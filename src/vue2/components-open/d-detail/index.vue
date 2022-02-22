<template lang="pug">
.d-detail.fn-flex(v-if="show")
	left
	ul.d-detail-right.fn-flex
		li.fn-flex.flex-column.pointer(@click.stop="openScreenHistoryRecord")
			e-svg(icon-class="smile", :size="18")
			span 历史记录
		li.fn-flex.flex-column.pointer(@click.stop="search")
			e-svg(icon-class="search", :size="18")
			span 搜索
		li.fn-flex.flex-column.pointer.pos-r(@click.stop="notice", :class="{ active: Object.keys(this.editor.log.list).length }")
			e-svg(icon-class="notice", :size="18")
			span 消息
		li.fn-flex.flex-column.pointer(@click="preview")
			e-svg(icon-class="preview", :size="20")
			span 预览
		li.fn-flex.flex-column.pointer(@click="handleExport")
			e-svg(icon-class="export", :size="20")
			span 导出
		li.fn-flex.flex-column.pointer(@click="importModal = true")
			e-svg(icon-class="import", :size="20")
			span 导入
		li.fn-flex.flex-column.pointer(@click="handleSave(true)")
			e-svg(icon-class="save", :size="20")
			span 保存
		li.fn-flex.flex-column.pointer(@click="handlePublish")
			e-svg(icon-class="publish", :size="20")
			span 发布
	load-mask(:show="loading") {{ loadingMsg }}
	i-modal(v-model="importModal", :footer-hide="true")
		i-form
			i-form-item
				input#originFile.fn-hide(type="file", accept="application/json", @change="handleFile")
				label.ivu-btn.ivu-btn-primary.d-detail-import-button(for="originFile") 选择导入文件
	search(v-model="searchModal", :hide="() => (searchModal = false)")
	notice(v-model="noticeModal")
	historyRecord(v-model="historyRecordModal", :screenHistoryRecord="screenHistoryRecord")
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Button, Modal, Form, FormItem, Input, Tooltip } from 'view-design'
import loadMask from '../load-mask/index.vue'
import { downloadFile, getQueryString } from '@/vue2/utils'
import search from './search.vue'
import notice from './notice.vue'
import historyRecord from './history-record.vue'
import Editor from '@/core/Editor'
import { detail, detailFile, create, update, screenHistoryList, screenPublish } from '@/vue2/api/screen.api'
import { screenShareUpdate } from '@/vue2/api/screenShare.api'
import left from './left.vue'

@Component({
	components: {
		'i-button': Button,
		loadMask,
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-tooltip': Tooltip,
		search,
		notice,
		left,
		historyRecord,
	},
})
export default class DDetail extends Vue {
	@Prop({ default: true }) show: boolean
	editor: Editor = Editor.Instance()
	screenHistoryRecord = []
	loadingMsg = 'loading…'
	shareModal = false
	searchModal = false
	loading = false
	importModal = false
	noticeModal = false
	historyRecordModal = false
	isNew = true
	notice(): void {
		this.noticeModal = true
	}
	search(): void {
		this.searchModal = true
	}
	openScreenHistoryRecord(): void {
		this.historyRecordModal = true
	}
	preview(): void {
		const scene = this.editor.mainScene ? `&scene=${this.editor.mainScene}` : ''
		if (this.isNew) {
			sessionStorage.setItem('previewData', JSON.stringify(this.editor.screen))
			window.open(`${location.origin}/detail/preview?layoutMode=${this.editor.layoutMode}${scene}`)
		} else {
			window.open(
				`${location.origin}/detail/${this.$route.params.id}?layoutMode=${this.editor.layoutMode}${scene}`,
			)
		}
	}

	beforeDestroy(): void {
		this.editor.clear()
	}

	mounted(): void {
		const templateId = this.$route.query.templateId
		const id = this.$route.params.id || templateId
		const shareScreenId = this.$route.params.shareScreenId
		const file = this.$route.params.file
		this.isNew = !id
		if (id) {
			if (id === 'preview') {
				this.editor.init(JSON.parse(sessionStorage.getItem('previewData')))
			} else {
				detail({ screenId: id }).then(res => {
					this.editor.init(res)
				})
				screenHistoryList({ screenId: id }).then(res => {
					this.screenHistoryRecord = res.historyRecords || []
				})
			}
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

	async handleSave(jump = false): Promise<void> {
		this.loading = true
		const screenData = this.editor.screenData()
		const sceneData = this.editor.sceneData()
		if (this.isNew) {
			try {
				const res = await create({
					...screenData,
					...sceneData,
				})
				this.$Message.success('保存成功！')
				screenShareUpdate({
					screenId: res.screenId,
					screenGuide: this.editor.ruler.guideLines,
				})
				this.editor.recordId = res.recordId
				const usedInComponentDevMode = process?.env?.VUE_APP_DEVMODE === '1'
				screenHistoryList({ screenId: res.screenId }).then(res => {
					this.screenHistoryRecord = res.historyRecords || []
				})
				if (jump && !usedInComponentDevMode) {
					location.href = `/editor/manger/${res.screenId}`
				}
			} finally {
				this.loading = false
			}
		} else {
			try {
				const res = await update({
					...screenData,
					...sceneData,
					screenId: this.editor.screenId,
				})
				this.$Message.success('修改成功')
				this.editor.recordId = res.recordId
				screenHistoryList({ screenId: res.screenId }).then(historyRes => {
					this.screenHistoryRecord = historyRes.historyRecords || []
				})
			} finally {
				this.loading = false
			}
		}
	}
	async handlePublish(): Promise<void> {
		await this.handleSave()
		this.loading = true
		const screenData = this.editor.screenData()
		const sceneData = this.editor.sceneData()
		try {
			await screenPublish({
				...screenData,
				...sceneData,
			})
			this.$Message.success('发布成功')
		} finally {
			this.loading = false
		}
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
				this.loading = false
				this.$Message.error('配置文件识别失败')
			}
		}
		reader.onerror = () => {
			this.loading = false
			this.$Message.error('配置文件识别失败')
		}
		reader.readAsText(file)
	}
}
</script>
<style lang="scss" scoped>
.d-detail-right {
	height: 100%;

	li {
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 0 15px;
		color: var(--text-tab);

		span {
			margin-top: 4px;
		}

		&:hover {
			color: #fff;
			background-color: #30333d;
		}
		&.active {
			&::before {
				position: absolute;
				top: 5px;
				right: 5px;
				width: 4px;
				height: 4px;
				content: '';
				background-color: var(--primary-color);
				border-radius: 50%;
			}
		}
	}
}

.d-detail-import-button {
	line-height: 32px;
}

.d-detail {
	align-items: center;
	width: 100%;
	min-width: 1088px;
	height: 60px;
	color: var(--text-tab);
	background: var(--background-2);

	/deep/ button {
		margin-left: 10px;
	}
}
</style>
