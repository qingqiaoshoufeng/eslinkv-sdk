<template lang="pug">
.d-detail.fn-flex(v-if="show")
	.d-detail-left.fn-flex
		.d-detail-left-icon-box.fn-flex
			i-tooltip(placement="bottom", content="组件区")
				i-icon.pointer(
					type="ios-cube-outline",
					@click.native="editor.taggerXRoomL1",
					:size="18",
					:class="{ active: editor.xRoomL1 > 0 }")
			i-tooltip(placement="bottom", content="场景区")
				i-icon.pointer(
					type="ios-photos-outline",
					@click.native="editor.taggerXRoomL2",
					:size="18",
					:class="{ active: editor.xRoomL2 > 0 }")
			i-tooltip(placement="bottom", content="设置区")
				i-icon.pointer(
					type="ios-archive-outline",
					@click.native="editor.taggerXRoomR1",
					:size="18",
					:class="{ active: editor.xRoomR1 > 0 }")
	.d-detail-middle.fn-flex
		span.d-detail-title {{ editor.name }}
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
		li.fn-flex.flex-column.pointer(@click="handleSave")
			i-icon(type="ios-cloud-done-outline", :size="24")
			span 保存
	load-mask(:show="loading") {{ loadingMsg }}
	i-modal(v-model="importModal", :footer-hide="true")
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
import { downloadFile, getQueryString } from '@/utils'
import dSearch from '@/components/d-search/index.vue'
import Editor from '@/core/Editor'
import { detail, detailFile, create, update } from '@/api/screen.api'
import { use } from '@/api/marketComponent.api'
import { screenShareUpdate } from '@/api/screenShare.api'

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
	editor: Editor = Editor.Instance()
	loadingMsg = 'loading…'
	shareModal = false
	searchModal = false
	loading = false
	importModal = false
	isNew = true

	search(): void {
		this.searchModal = true
	}

	preview(): void {
		const scene = this.editor.mainScene
			? `&scene=${this.editor.mainScene}`
			: ''
		window.open(
			`${location.origin}/detail/${this.$route.params.id}?layoutMode=${this.editor.layoutMode}${scene}`,
		)
	}

	loadMarketComponent(screen: any): void {
		let p = []
		this.loading = true
		screen.marketComponents.forEach(item => {
			if (this.editor.widgetLoaded[`${item.type}${item.version}`]) return
			p.push(
				new Promise((resolve, reject) => {
					use({
						componentEnTitle: item.type,
						componentVersion: item.version,
					}).then((res: any) => {
						const script = document.createElement('script')
						script.onload = () => {
							this.editor.updateWidgetLoaded(
								`${item.type}${item.version}`,
							)
							resolve(1)
						}
						script.onerror = () => {
							reject(1)
						}
						if (res) {
							script.src = res.componentJsUrl
							document.head.appendChild(script)
						} else {
							console.error(
								`${item.type}${item.version}加载组件失败`,
							)
						}
					})
				}),
			)
		})
		Promise.all(p)
			.then(() => {
				this.loading = false
				for (let key in screen.screenWidgets) {
					if (screen.screenWidgets[key].value) {
						screen.screenWidgets[key].config =
							screen.screenWidgets[key].value
						delete screen.screenWidgets[key].value
					}
				}
				this.editor.screen.screenWidgets = screen.screenWidgets
				// const widgets = Object.values(screen.screenWidgets)
				// widgets.forEach((item: any) => {
				// 	if (item.scene !== 0) {
				// 		if (!this.sceneWidgets[item.scene]) {
				// 			this.sceneWidgets[item.scene] = {}
				// 		}
				// 		if (!this.sceneWidgets[item.scene].list) {
				// 			this.sceneWidgets[item.scene].list = []
				// 		}
				// 		this.sceneWidgets[item.scene].list.push(item)
				// 	}
				// })
			})
			.catch(e => {
				this.loading = false
				console.error(e)
				console.error('组件初始化加载失败')
			})
		if (p.length === 0) {
			this.loading = false
		}
	}

	mounted(): void {
		const templateId = this.$route.query.templateId
		const id = this.$route.params.id || templateId
		const file = this.$route.params.file
		this.isNew = !id
		if (id) {
			detail({ screenId: id }).then(res => {
				const result = this.editor.init(res)
				this.loadMarketComponent(result.screen)
			})
		} else if (file) {
			detailFile(decodeURIComponent(file)).then(res => {
				this.editor.init(res)
			})
		} else {
			this.editor.init()
		}
		const sceneIndex = getQueryString('scene')
		if (sceneIndex) {
			this.editor.setSceneIndex(sceneIndex)
		}
	}

	handleExport(): void {
		const screenData = this.editor.screenData()
		const sceneData = this.editor.sceneData()
		const fileName = `${this.editor.name}`
		this.$Modal.confirm({
			title: `导出文件：${fileName}.json`,
			content: '可用于看板数据备份、迁移。',
			onOk: () => {
				const config = { ...screenData, ...sceneData }
				downloadFile(config, fileName, 'json')
			},
			okText: '确定',
			cancelText: '取消',
		})
	}

	handleSave(): void {
		let isNew = false
		this.$Modal.confirm({
			title: `确定${this.isNew || isNew ? '创建' : '更新'}大屏吗？`,
			content: '回收站内的组件将被清除！',
			okText: '确定',
			cancelText: '取消',
			onOk: () => {
				this.loading = true
				const screenData = this.editor.screenData()
				const sceneData = this.editor.sceneData()
				if (this.isNew || isNew) {
					create({
						...screenData,
						...sceneData,
					})
						.then(res => {
							this.$Message.success('保存成功！')
							screenShareUpdate({
								screenId: res.screenId,
								screenGuide: this.editor.ruler.guideLines,
							})
							this.loading = false
							this.$router.back()
						})
						.catch(() => {
							this.loading = false
						})
				} else {
					update({
						...screenData,
						...sceneData,
						screenId: this.editor.screenId,
					})
						.then(() => {
							this.$Message.success('修改成功')
							this.loading = false
						})
						.catch(() => {
							this.loading = false
						})
				}
			},
		})
	}

	handleFile(e: any): void {
		const file = e.target.files[0]
		const reader = new FileReader()
		reader.onload = e => {
			try {
				this.loading = true
				const result = JSON.parse((e as any).target.result)
				this.editor.init(result)
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
