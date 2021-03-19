<template lang="pug">
	.d-detail
		.d-footer.fn-flex(v-if="show")
			.d-footer-left.fn-flex
				span.d-footer-title {{ platform.panelConfig.info ? platform.panelConfig.info.name : '' }}
			.d-footer-right.fn-flex
				//i-button(@click="saveSnapshot") 保存截图
				i-button(:disabled="disabled" @click="exit") 返回
				i-button(:disabled="disabled" @click="preview") 预览
				i-button(:disabled="disabled" type="primary" @click="handleSave(0)" :loading="loading") 保存
				i-button(:disabled="disabled" type="primary" @click="handleSave(1)" :loading="loading" v-if="isNew") 保存为模板
				i-button(:disabled="disabled" @click="publishBoard" :loading="loading" v-if="!isNew") 发布
				i-button(:disabled="disabled" @click="handleExport" :loading="loading") 导出
				i-button(:disabled="disabled" @click="importModal=true" :loading="loading") 导入
			load-mask(:show="saving") 正在保存数据…
			Modal(v-model="importModal")
				Form
					FormItem
						label.ivu-btn.ivu-btn-primary.d-footer-import-button(for="originFile") 全覆盖导入
						input.fn-hide#originFile(type="file" accept="application/json" @change="handleFile")
</template>
<script lang="ts">
	import { Component, Prop } from 'vue-property-decorator'
	import { Icon, Button, Modal, Form, FormItem } from 'view-design'
	import copy from 'fast-copy'
	import { mixins } from 'vue-class-component'
	import platform from '../../store/platform.store'
	import scene from '../../store/scene.store'
	import commonConfigValue from '../../../common-config-value'
	import { isObjectString } from '../../utils/index'
	import loadMask from '../load-mask/index.vue'
	import importMx from './import.mx'
	import exportMx from './export.mx'
	import publishMx from './publish.mx'
	import detailMx from './detail.mx'
	import saveMx from './save.mx'

	@Component({
		components: {
			'i-icon': Icon,
			'i-button': Button,
			loadMask,
			Modal,
			Form,
			FormItem
		}
	})
	export default class DFooter extends mixins(exportMx, detailMx, saveMx, importMx, publishMx) {
		@Prop(Boolean) kanboardEdited: boolean
		@Prop({ default: false }) disabled: boolean
		@Prop({ default: true }) show: boolean // detail,full,local 隐藏该模块

		platform = platform.state
		scene = scene.state
		saving = false
		loading = false
		isNew = true
		type = 0 // 数据类型：0:看板, 1:小工具模板, 2:参考线模板

		preview () {
			document.body.requestFullscreen()
			this.$router.push('/preview')
		}

		exit () {
			if (this.kanboardEdited) {
				this.$Modal.confirm({
					title: '提示',
					content: '看板已编辑，关闭窗口将丢失未保存的数据，确认关闭吗？',
					onOk: () => {
						this.$router.replace({ name: 'big-data-list' })
					}
				})
				return
			}
			this.$router.go(-1)
		}

		getAttr (o, str) {
			const arr = str.split('.')
			let res = o
			for (const v of arr) {
				if (res[v] === undefined) {
					res = {}
					break
				}
				res = res[v]
			}
			return res
		}

		checkAttr (o, str = '', defaultConfig) {
			for (const key in o) {
				const prop = str ? str + '.' + key : key
				if (Array.isArray(o[key]) && o[key].length > 0) {
					if (JSON.stringify(o[key]) === JSON.stringify(this.getAttr(defaultConfig, prop))) {
						o[key] = 'default'
					}
				} else if (Object.prototype.toString.call(o[key]) === '[object Object]') {
					if (JSON.stringify(o[key]) === JSON.stringify(this.getAttr(defaultConfig, prop))) {
						o[key] = 'default'
					} else {
						this.checkAttr(o[key], prop, defaultConfig)
					}
				}
			}
		}

		platFormData () {
			const defaultConfig = commonConfigValue() // 读取默认配置
			const panelConfig = this.platform.panelConfig
			const { size, info: { name } } = panelConfig
			delete size.preset
			if (size.range && !Object.values(size.range).find(item => item !== 0 && item !== '%')) {
				delete size.range
			}
			const widgetAdded = copy(this.platform.widgetAdded)
			const widgets = Object.values(widgetAdded).map(({ id, market = false, type, config, scene = 0 }) => {
				const api = config.api
				if (api && api.data) {
					if (isObjectString(api.data)) {
						try {
							api.data = JSON.stringify(JSON.parse(api.data))
						} catch (e) {
							throw new Error(e)
						}
					}
				}
				this.checkAttr(config, '', defaultConfig)
				return {
					id,
					scene,
					type,
					market,
					value: { ...config }
				}
			})

			// todo 需要接口配合 参考线数据 存入另一个接口
			const guides = this.platform.ruler.guideLines
			return {
        screenName: name,
				// todo 需要接口配合 去除一个参数需要看下是否可行
				// createTime: format(Date.now(), 'yyyy-MM-dd hh:mm:ss'),
        screenConfig: JSON.stringify({
					kanboard: panelConfig, // 看板画布配置
					widgets, // 小工具配置
					scene: this.scene.obj, // 场景
					guides // 参考线
				})
			}
		}

		created () {
			platform.state.currentType = 0
		}

		mounted () {
			this.isNew = !this.$route.params.id
		}
	}
</script>
<style lang="scss" scoped>
	.d-footer {
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 50px;
		padding: 0 15px;

		/deep/ button {
			margin-left: 10px;
		}

		.d-footer-left,
		.d-footer-right {
			align-items: center;

			.return {
				margin-left: 0;
			}
		}

		.d-footer-import-button {
			line-height: 32px;
		}

		.d-footer-left {
			.d-footer-title {
				padding: 0 15px 0 0;
				font-size: 15px;
			}
		}
	}
</style>
