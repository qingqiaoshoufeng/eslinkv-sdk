<template lang="pug">
.d-detail.fn-flex(v-if="show")
	.d-detail-left.fn-flex
		.d-detail-left-icon-box.fn-flex
			i-tooltip(placement="bottom", content="组件区")
				i-icon.pointer(
					type="ios-cube-outline",
					@click="handleLeft1",
					:size="18",
					:class="{ active: ruler.xRoomL1 > 0 }")
			i-tooltip(placement="bottom", content="场景区")
				i-icon.pointer(
					type="ios-photos-outline",
					@click="handleLeft2",
					:size="18",
					:class="{ active: ruler.xRoomL2 > 0 }")
			i-tooltip(placement="bottom", content="设置区")
				i-icon.pointer(
					type="ios-archive-outline",
					@click="handleRight1",
					:size="18",
					:class="{ active: ruler.xRoomR1 > 0 }")
	.d-detail-middle.fn-flex
		span.d-detail-title {{ platform.screenName }}
	ul.d-detail-right.fn-flex
		li.fn-flex.flex-column.pointer(@click.stop="search")
			i-icon(type="ios-search-outline", :size="24")
			span 搜索
		li.fn-flex.flex-column.pointer(@click="preview", v-if="!isNew")
			i-icon(type="ios-desktop-outline", :size="24")
			span 预览
		li.fn-flex.flex-column.pointer(@click="handleExport")
			i-icon(type="ios-cloud-download-outline", :size="24")
			span 导出
		li.fn-flex.flex-column.pointer(@click="importModal = true")
			i-icon(type="ios-cloud-upload-outline", :size="24")
			span 导入
	load-mask(:show="loading") {{ loadingMsg }}
	i-modal(v-model="importModal")
		i-form
			i-form-item
				label.ivu-btn.ivu-btn-primary.d-detail-import-button(for="originFile") 选择导入文件
				input#originFile.fn-hide(
					type="file",
					accept="application/json",
					@change="handleFile")
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import {
	Icon,
	Button,
	Modal,
	Form,
	FormItem,
	Input,
	Tooltip,
} from 'view-design'
import copy from 'fast-copy'
import { mixins } from 'vue-class-component'
import platform from '../../store/platform.store'
import ruler from '../../store/ruler.store'
import scene from '../../store/scene.store'
import commonConfigValue from '../../../common-config-value'
import loadMask from '../load-mask/index.vue'
import importMx from './import.mx'
import exportMx from './export.mx'
import detailMx from './detail.mx'

@Component({
	components: {
		'i-icon': Icon,
		'i-button': Button,
		loadMask,
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-tooltip': Tooltip,
	},
})
export default class DDetail extends mixins(
	// @ts-ignore
	exportMx,
	detailMx,
	importMx,
) {
	@Prop({ default: true }) show: boolean // detail,full,local 隐藏该模块

	platform = platform.state
	ruler = ruler.state
	scene = scene.state
	loadingMsg = 'loading…'
	shareModal = false
	loading = false
	isNew = true
	screenType = 'CUSTOM' // 数据类型：0:看板, 1:小工具模板, 2:参考线模板

	handleLeft1() {
		this.ruler.xRoomL1 = this.ruler.xRoomL1 > 0 ? 0 : 238
		localStorage.setItem('xRoomL1', this.ruler.xRoomL1)
	}

	handleRight1() {
		this.ruler.xRoomR1 = this.ruler.xRoomR1 > 0 ? 0 : 350
		localStorage.setItem('xRoomR1', this.ruler.xRoomR1)
	}

	handleLeft2() {
		this.ruler.xRoomL2 = this.ruler.xRoomL2 > 0 ? 0 : 238
		localStorage.setItem('xRoomL2', this.ruler.xRoomL2)
	}

	search() {
		this.platform.searchModal = true
	}

	preview() {
		window.open(
			`${location.origin}/detail/${this.$route.params.id}?layoutMode=${this.platform.layoutMode}`,
		)
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
		return {
			screenName: this.platform.screenName,
			screenConfig: {
				widgets, // 小工具配置
				scene: this.scene.obj, // 场景
			},
		}
	}

	mounted() {
		this.isNew = !this.$route.params.id
	}
}
</script>
<style lang="scss" scoped>
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
			background-color: var(--themeColor);
			border: 1px solid var(--themeColor);
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

	/deep/ button {
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
