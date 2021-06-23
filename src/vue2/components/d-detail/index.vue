<template lang="pug">
.d-detail.fn-flex(v-if="show")
	.d-detail-left.fn-flex
		.d-detail-left-icon-box.fn-flex
			i-tooltip(placement="bottom", content="组件区")
				.left-icon.pointer(:class="{ active: editor.xRoomL1 > 0 }")
					d-svg(icon-class="widget", :size="18", @click.native="editor.taggerXRoomL1")
			i-tooltip(placement="bottom", content="场景区")
				.left-icon.pointer(:class="{ active: editor.xRoomL2 > 0 }")
					d-svg(icon-class="scene", :size="18", @click.native="editor.taggerXRoomL2")
			i-tooltip(placement="bottom", content="设置区")
				.left-icon.pointer(:class="{ active: editor.xRoomR1 > 0 }")
					d-svg(icon-class="setting", :size="18", @click.native="editor.taggerXRoomR1")
	.d-detail-middle.fn-flex
		span.d-detail-title {{ editor.name }}
	ul.d-detail-right.fn-flex
		li.fn-flex.flex-column.pointer(@click.stop="search")
			d-svg(icon-class="search", :size="18")
			span 搜索
		li.fn-flex.flex-column.pointer(@click="preview", v-if="!isNew")
			d-svg(icon-class="preview", :size="20")
			span 预览
		li.fn-flex.flex-column.pointer(@click="handleExport")
			d-svg(icon-class="export", :size="20")
			span 导出
		li.fn-flex.flex-column.pointer(@click="importModal = true")
			d-svg(icon-class="import", :size="20")
			span 导入
		li.fn-flex.flex-column.pointer(@click="handleSave")
			d-svg(icon-class="save", :size="20")
			span 保存
	load-mask(:show="loading") {{ loadingMsg }}
	i-modal(v-model="importModal", :footer-hide="true")
		i-form
			i-form-item
				input#originFile.fn-hide(type="file", accept="application/json", @change="handleFile")
				label.ivu-btn.ivu-btn-primary.d-detail-import-button(for="originFile") 选择导入文件
	d-search(v-model="searchModal", :hide="() => (searchModal = false)")
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Icon, Button, Modal, Form, FormItem, Input, Tooltip } from 'view-design'
import loadMask from '../load-mask/index.vue'
import { downloadFile, getQueryString } from '@/vue2/utils'
import dSearch from '@/vue2/components/d-search/index.vue'
import Editor from '@/core/Editor'
import { detail, detailFile, create, update } from '@/vue2/api/screen.api'
import { screenShareUpdate } from '@/vue2/api/screenShare.api'

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
		const scene = this.editor.mainScene ? `&scene=${this.editor.mainScene}` : ''
		window.open(`${location.origin}/detail/${this.$route.params.id}?layoutMode=${this.editor.layoutMode}${scene}`)
	}

	mounted(): void {
		const templateId = this.$route.query.templateId
		const id = this.$route.params.id || templateId
		const shareScreenId = this.$route.params.shareScreenId
		const file = this.$route.params.file
		this.isNew = !id
		if (id) {
			detail({ screenId: id }).then(res => {
				this.editor.init(res)
			})
		} else if (file) {
			detailFile(decodeURIComponent(file)).then(res => {
				this.editor.init(res)
			})
		} else if (!shareScreenId) {
			this.editor.init()
		}
		const sceneIndex = getQueryString('scene')
		this.editor.selectSceneIndex(sceneIndex)
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

	.left-icon {
		height: 28px;
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
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 0 15px;
		color: var(--white);

		span {
			margin-top: 4px;
		}

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
