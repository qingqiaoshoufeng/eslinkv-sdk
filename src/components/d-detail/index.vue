<template lang="pug">
.d-detail.fn-flex(v-if="show")
	.d-detail-left.fn-flex
		.d-detail-left-icon.fn-flex
			i-icon.pointer(type="ios-arrow-dropleft", @click="exit", :size="24")
		.d-detail-left-icon-box.fn-flex
			i-icon.pointer(
				title="组件",
				type="ios-cube-outline",
				@click="handleLeft1",
				:size="18",
				:class="{ active: left1 }")
			i-icon.pointer(
				title="场景",
				type="ios-photos-outline",
				@click="handleLeft2",
				:size="18",
				:class="{ active: left2 }")
			i-icon.pointer(
				title="设置",
				type="ios-archive-outline",
				@click="handleRight1",
				:size="18",
				:class="{ active: right1 }")
	.d-detail-middle.fn-flex
		span.d-detail-title {{ platform.screenName }}
	ul.d-detail-right.fn-flex
		li.fn-flex.flex-column.pointer(@click="preview", v-if="!isNew")
			i-icon(type="ios-desktop-outline", :size="24")
			span 预览
		li.fn-flex.flex-column.pointer(@click="handleExport")
			i-icon(type="ios-cloud-download-outline", :size="24")
			span 导出
		li.fn-flex.flex-column.pointer(@click="importModal = true")
			i-icon(type="ios-cloud-upload-outline", :size="24")
			span 导入
		li.fn-flex.flex-column.pointer(@click="handleSave('CUSTOM')")
			i-icon(type="ios-cloud-done-outline", :size="24")
			span 保存
		//li.fn-flex.flex-column.pointer(@click="handleSave('TEMPLATE')" v-if="screenType==='CUSTOM'")
		//  i-icon(type="ios-cloud-circle-outline" :size="24")
		//  span 模板
		li.fn-flex.flex-column.pointer(@click="handleShare", v-if="!isNew")
			i-icon(type="ios-paper-plane-outline", :size="24")
			span 分享
	load-mask(:show="loading") {{ loadingMsg }}
	i-modal(v-model="importModal")
		i-form
			i-form-item
				label.ivu-btn.ivu-btn-primary.d-detail-import-button(for="originFile") 选择导入文件
				input#originFile.fn-hide(
					type="file",
					accept="application/json",
					@change="handleFile")
	i-modal(v-model="shareModal", :footer-hide="true")
		p(:style="{ marginBottom: '10px' }") 快生成链接，分享给你的好友吧
		.fn-flex.flex-row(:style="{ marginBottom: '10px' }")
			label.ivu-btn.d-detail-share-button(
				:class="{ 'ivu-btn-primary': shareType === 'ALL' }",
				@click="shareType = 'ALL'") 不限制
			label.ivu-btn.d-detail-share-button(
				:class="{ 'ivu-btn-primary': shareType === 'PASSWORD' }",
				@click="shareType = 'PASSWORD'") 加密分享
			label.ivu-btn.d-detail-share-button(
				:class="{ 'ivu-btn-primary': shareType === 'TIME' }",
				@click="shareType = 'TIME'") 时效分享
		.fn-flex.flex-row(:style="{ marginBottom: '10px' }")
			i-input(
				v-show="shareType === 'PASSWORD'",
				:style="{ width: '150px' }",
				v-model="sharePassword")
				span(slot="prepend") 密钥
			i-input(
				v-show="shareType === 'TIME'",
				:style="{ width: '150px' }",
				v-model="shareTime")
				span(slot="append") 小时
			i-button(
				type="primary",
				@click="shareSubmit",
				:style="{ marginLeft: '10px' }") 生成
		.deadline(v-if="shareType === 'TIME'") 到期时间：{{ deadline }}
		.fn-flex.flex-row
			i-input(search, readonly, enter-button="复制", @on-search="handleCopy" v-model="shareUrl")
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { Icon, Button, Modal, Form, FormItem, Input } from 'view-design'
import copy from 'fast-copy'
import { mixins } from 'vue-class-component'
import platform from '../../store/platform.store'
import scene from '../../store/scene.store'
import commonConfigValue from '../../../common-config-value'
import loadMask from '../load-mask/index.vue'
import importMx from './import.mx'
import exportMx from './export.mx'
import detailMx from './detail.mx'
import saveMx from './save.mx'
import shareMx from './share.mx'

@Component({
	components: {
		'i-icon': Icon,
		'i-button': Button,
		loadMask,
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
	},
})
export default class DDetail extends mixins(
	// @ts-ignore
	exportMx,
	detailMx,
	saveMx,
	importMx,
	shareMx,
) {
	@Prop(Boolean) kanboardEdited: boolean
	@Prop({ default: true }) show: boolean // detail,full,local 隐藏该模块

	platform = platform.state
	scene = scene.state
	loadingMsg = 'loading…'
	loading = false
	isNew = true
	screenType = 'CUSTOM' // 数据类型：0:看板, 1:小工具模板, 2:参考线模板
	left1 = true
	right1 = true
	left2 = true
	xRoomL1 = 0
	xRoomL2 = 0
	xRoomR1 = 0

	handleLeft1() {
		this.left1 = !this.left1
		if (this.left1) {
			this.platform.ruler.xRoomL1 = this.xRoomL1
			this.xRoomL1 = 0
		} else {
			this.xRoomL1 = this.platform.ruler.xRoomL1
			this.platform.ruler.xRoomL1 = 0
		}
	}

	handleRight1() {
		this.right1 = !this.right1
		if (this.right1) {
			this.platform.ruler.xRoomR1 = this.xRoomR1
			this.xRoomR1 = 0
		} else {
			this.xRoomR1 = this.platform.ruler.xRoomR1
			this.platform.ruler.xRoomR1 = 0
		}
	}

	handleLeft2() {
		this.left2 = !this.left2
		if (this.left2) {
			this.platform.ruler.xRoomL2 = this.xRoomL2
			this.xRoomL2 = 0
		} else {
			this.xRoomL2 = this.platform.ruler.xRoomL2
			this.platform.ruler.xRoomL2 = 0
		}
	}

	preview() {
		window.open(
			`${location.origin}/detail/${this.$route.params.id}?layoutMode=${this.platform.panelConfig.size.layoutMode}`,
		)
	}

	exit() {
		if (this.kanboardEdited) {
			this.$Modal.confirm({
				title: '提示',
				content: '看板已编辑，关闭窗口将丢失未保存的数据，确认关闭吗？',
				onOk: () => {
					this.$router.replace({ name: 'big-data-list' })
				},
			})
			return
		}
		this.$router.go(-1)
	}

	getAttr(o, str) {
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

	checkAttr(o, str = '', defaultConfig) {
		for (const key in o) {
			const prop = str ? str + '.' + key : key
			if (Array.isArray(o[key]) && o[key].length > 0) {
				if (
					JSON.stringify(o[key]) ===
					JSON.stringify(this.getAttr(defaultConfig, prop))
				) {
					o[key] = 'default'
				}
			} else if (
				Object.prototype.toString.call(o[key]) === '[object Object]'
			) {
				if (
					JSON.stringify(o[key]) ===
					JSON.stringify(this.getAttr(defaultConfig, prop))
				) {
					o[key] = 'default'
				} else {
					this.checkAttr(o[key], prop, defaultConfig)
				}
			}
		}
	}

	platFormData() {
		const defaultConfig = commonConfigValue() // 读取默认配置
		const panelConfig = this.platform.panelConfig
		delete panelConfig.info
		delete panelConfig.id
		const { size } = panelConfig
		delete size.preset
		if (
			size.range &&
			!Object.values(size.range).find(item => item !== 0 && item !== '%')
		) {
			delete size.range
		}
		const widgetAdded = copy(this.platform.widgetAdded)
		const widgets = Object.values(widgetAdded).map(
			({ id, market = false, type, config, scene = 0 }) => {
				const api = config.api
				if (api && api.data) {
					try {
						api.data = JSON.stringify(JSON.parse(api.data))
					} catch (e) {
						console.warn(e)
					}
				}
				this.checkAttr(config, '', defaultConfig)
				return {
					id,
					scene,
					type,
					market,
					value: { ...config },
				}
			},
		)

		const guides = this.platform.ruler.guideLines
		return {
			screenName: this.platform.screenName,
			screenConfig: {
				kanboard: panelConfig, // 看板画布配置
				widgets, // 小工具配置
				scene: this.scene.obj, // 场景
				guides, // 参考线
			},
		}
	}

	mounted() {
		this.isNew = !this.$route.params.id
	}
}
</script>
<style lang="scss" scoped>
@import '../../scss/conf';

.d-detail-left-icon-box {
	margin-left: 20px;

	.ivu-icon {
		padding: 4px 10px;
		margin-right: 10px;
		color: rgb(161, 174, 179);
		background-color: #303640;
		border: 1px solid rgba(255, 235, 235, 0.1);
		border-radius: 2px;

		&:hover {
			background-color: #414750;
		}

		&.active {
			color: var(--white);
			background-color: $themeColor;
			border: 1px solid $themeColor;
		}
	}
}

.d-detail-right {
	height: 100%;

	li {
		justify-content: center;
		height: 100%;
		padding: 0 15px;
		color: var(--white);

		&:hover {
			background-color: var(--white_01);
		}
	}
}

.d-detail-left-icon {
	align-items: center;
	height: 100%;
	padding: 0 15px;
	color: var(--white);

	> i {
		line-height: 60px;
	}

	&:hover {
		background-color: var(--white_01);
	}
}

.d-detail-share-button {
	line-height: 32px;
	border-radius: 0;
}

.d-detail-import-button {
	line-height: 32px;
}

.d-detail {
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 60px;
	background-color: #313239;
	border-bottom: 1px solid #000;

	&::v-deep button {
		margin-left: 10px;
	}
}

.d-detail-title {
	font-size: 15px;
	color: var(--white);
}

.d-detail-left {
	align-items: center;
	height: 100%;
}

.deadline {
	margin-bottom: 10px;
}
</style>
