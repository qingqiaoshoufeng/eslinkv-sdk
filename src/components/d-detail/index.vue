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
		span.d-detail-title {{ screen.name }}
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
		li.fn-flex.flex-column.pointer(@click="handleSave('CUSTOM')")
			i-icon(type="ios-cloud-done-outline", :size="24")
			span 保存
	load-mask(:show="loading") {{ loadingMsg }}
	i-modal(v-model="importModal")
		i-form
			i-form-item
				input#originFile.fn-hide(
					type="file",
					accept="application/json",
					@change="handleFile")
				label.ivu-btn.ivu-btn-primary.d-detail-import-button(for="originFile") 选择导入文件
	d-search(v-model="searchModal", :hide="() => (searchModal = false)")
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {
	Icon,
	Button,
	Modal,
	Form,
	FormItem,
	Input,
	Tooltip,
} from 'view-design'
import loadMask from '../load-mask/index.vue'
import ScreenPc from '@/controller/Screen/pc'
import { downloadFile, getQueryString } from '@/utils'
import dSearch from '@/components/d-search/index.vue'

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
		dSearch,
	},
})
export default class DDetail extends Vue {
	@Prop({ default: true }) show: boolean
	ruler: RulerV = {}
	screen: ScreenV = {}
	loadingMsg = 'loading…'
	shareModal = false
	searchModal = false
	loading = false
	importModal = false
	isNew = true

	handleLeft1() {
		this.ruler.xRoomL1 = this.ruler.xRoomL1 > 0 ? 0 : 238
		localStorage.setItem('xRoomL1', `${this.ruler.xRoomL1}`)
	}

	handleRight1() {
		this.ruler.xRoomR1 = this.ruler.xRoomR1 > 0 ? 0 : 350
		localStorage.setItem('xRoomR1', `${this.ruler.xRoomR1}`)
	}

	handleLeft2() {
		this.ruler.xRoomL2 = this.ruler.xRoomL2 > 0 ? 0 : 238
		localStorage.setItem('xRoomL2', `${this.ruler.xRoomL2}`)
	}

	search() {
		this.searchModal = true
	}

	preview() {
		const scene = this.screen.mainScene
			? `&scene=${this.screen.mainScene}`
			: ''
		window.open(
			`${location.origin}/detail/${this.$route.params.id}?layoutMode=${this.screen.layoutMode}${scene}`,
		)
	}

	created() {
		const templateId = this.$route.query.templateId
		const id = this.$route.params.id || templateId
		this.isNew = !id
		this.screen = ScreenPc.getInstance({ screenId: id })
		const file = this.$route.params.file
		if (file) {
			this.$api.screen.detailFile(decodeURIComponent(file)).then(res => {
				this.screen.serialize(res)
			})
		}
		const sceneIndex = getQueryString('scene')
		if (sceneIndex) {
			this.screen.setSceneIndex(sceneIndex)
		}
	}

	handleExport() {
		const data = this.screen.screenData()
		const fileName = `${this.screen.screenName}`
		this.$Modal.confirm({
			title: `导出文件：${fileName}.json`,
			content: '可用于看板数据备份、迁移。',
			onOk: () => {
				const config = { ...data }
				downloadFile(config, fileName, 'json')
			},
			okText: '确定',
			cancelText: '取消',
		})
	}

	handleSave(type) {
		let isNew = false
		if (this.screen.screenType === 'CUSTOM' && type === 'TEMPLATE') {
			isNew = true
		}
		this.screen.screenType = type
		this.$Modal.confirm({
			title: `确定${this.isNew || isNew ? '创建' : '更新'}${
				this.screen.screenType === 'TEMPLATE' ? '大屏模版' : '大屏'
			}吗？`,
			content: '回收站内的组件将被清除！',
			okText: '确定',
			cancelText: '取消',
			onOk: () => {
				this.loading = true
				if (this.isNew || isNew) {
					this.screen
						.createScreen()
						.then(() => {
							this.loading = false
							this.$router.back()
						})
						.catch(() => {
							this.loading = false
						})
				} else {
					this.screen
						.updateScreen()
						.then(() => {
							this.loading = false
						})
						.catch(() => {
							this.loading = false
						})
				}
			},
		})
	}

	handleFile(e) {
		const file = e.target.files[0]
		const reader = new FileReader()
		reader.onload = e => {
			try {
				this.loading = true
				const result = JSON.parse((e as any).target.result)
				const { screenConfig, screenName, screenWidgets } = result
				this.screen.serialize({
					screenName,
					screenConfig,
					screenWidgets,
				})
				this.importModal = false
				this.loading = false
			} catch (e) {
				console.error(e)
				this.$Message.error('配置文件识别失败')
			}
		}
		reader.onerror = () => {
			this.$Message.error('配置文件识别失败')
		}
		reader.readAsText(file)
	}

	mounted() {
		this.ruler = this.$ruler
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
