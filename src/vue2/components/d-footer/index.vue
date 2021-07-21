<template lang="pug">
.d-footer.fn-flex.flex-row.pos-r.z-index-999
	.d-footer-bar.fn-flex.flex-row(@click="copyModel = true")
		.d-footer-bar-text.ellipsis(v-if="editor.sceneObj") {{ editor.currentSceneIndex === 0 ? '主场景' : editor.currentSceneIndex === -1 ? '回收站' : editor.sceneObj[editor.currentSceneIndex].name }}
		.d-footer-bar-text {{ editor.width }}×{{ editor.height }}px
	.d-footer-bar.fn-flex
		label.d-footer-hot-keys.pos-r.fn-flex.flex-row
			.d-footer-bar-text.pointer.ellipsis(@click="showHotKey = !showHotKey") 快捷键
			.d-footer-hot-key-list.pos-a(:class="{ active: showHotKey }")
				ul
					item-card(v-for="item in hotKeys", :key="item.name", :item="item")
	.d-footer-bar.fn-flex(:style="{ marginLeft: 'auto' }")
		i-tooltip(content="缩小")
			d-svg.pointer(icon-class="zoomOut", @click.native="() => editor.zoomOut()")
	.d-footer-bar.fn-flex
		label {{ zoom }}
	.d-footer-bar.fn-flex
		i-tooltip(content="放大")
			d-svg.pointer(icon-class="zoomIn", @click.native="() => editor.zoomIn()")
	.d-footer-bar.fn-flex(:style="{ marginRight: '0' }")
		i-tooltip(:content="editor.fullscreen ? '退出全屏' : '全屏'")
			d-svg.pointer(
				:icon-class="editor.fullscreen ? 'unfullscreen' : 'fullscreen'",
				:size="18",
				@click="handleFullscreen")
	.d-footer-bar.fn-flex
		i-icon(type="md-sync" @click="update" size="22" title="更新组件" style="margin-left: 10px;cursor: pointer")
	i-modal(v-model="copyModel", title="场景ID", :footer-hide="true")
		.fn-flex.flex-row
			span.fn-hide.copy-id {{ editor.currentSceneIndex }}
			i-input(
				:value="editor.currentSceneIndex",
				search,
				readonly,
				enter-button="复制",
				@on-search="handleCopy")
	updateDrawer(v-model="showDrawer" :data="updateInfo")
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Icon, Input, Modal, Tooltip } from 'view-design'
import updateDrawer from './updateDrawer.vue'
import Editor from '@/core/Editor'
import { copyText } from '@/vue2/utils'
import ItemCard from '@/vue2/components/d-footer/item-card.vue'
import { hotKeys } from '@/vue2/utils'
import { versionUpdateList } from '@/vue2/api/marketComponent.api'

@Component({
	components: {
		'i-icon': Icon,
		'i-input': Input,
		'i-modal': Modal,
		'i-tooltip': Tooltip,
		ItemCard,
		updateDrawer
	},
})
export default class DFooter extends Vue {
	showDrawer = false
	showHotKey = false
	copyModel = false
	updateInfo = []
	hotKeys = hotKeys
	editor: Editor = Editor.Instance()

	get zoom(): string {
		const zoom = this.editor.zoom
		return `${~~(zoom * 100)}%`
	}

	handleCopy(): void {
		copyText(this.editor.currentSceneIndex)
	}

	async update () {
		const req = []
		Object.values(this.editor.sceneWidgets[this.editor.current.currentSceneIndex]).forEach((v: any) => {
			if (v.market) {
				req.push({
					componentEnTitle: v.type,
					componentVersion: v.config.widget.componentVersion,
					componentId: v.id,
					componentTitle: v.config.widget.name
				})
			}
		})
		this.updateInfo = await versionUpdateList({ components: req })
		if (this.updateInfo.length === 0) {
			this.$Message.warning('暂无可更新组件')
			return
		}
		this.showDrawer = true
	}

	handleFullscreen(): void {
		if (this.editor.fullscreen) {
			document.exitFullscreen()
		} else {
			document.body.requestFullscreen()
		}
	}
}
</script>
<style lang="scss" scoped>
.d-footer {
	height: 32px;
	padding: 0 15px;
	background-color: #24262e;
}

.d-footer-bar-box {
	right: 0;
	bottom: 15px;
	user-select: none;
}

.d-footer-bar {
	align-items: center;
	justify-content: center;
	height: 100%;
	margin-right: 15px;
	color: var(--white_08);
	user-select: none;
	border-radius: 2px;
	transition: all 0.3s;

	.d-footer-bar-text {
		opacity: 0.5;
	}

	&:hover {
		.d-footer-bar-text {
			opacity: 1;
		}
	}
}

.d-footer-hot-keys,
.d-footer-info {
	align-items: center;
	justify-content: center;
}

.d-footer-info {
	margin-left: 10px;
}

.d-footer-hot-keys {
	width: 100%;
	height: 100%;

	.d-footer-hot-key-list {
		bottom: 100%;
		width: 230px;
		padding: 10px 10px 0 10px;
		color: var(--white_06);
		pointer-events: none;
		background: #2d2f38;
		border-radius: 2px;
		box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.57);
		opacity: 0;
		transition: all 0.3s;
		transform: translate3d(0, -20px, 0);

		&.active {
			opacity: 1;
			transform: translate3d(0, 0, 0);
		}
	}

	&:hover {
		color: var(--white);
	}
}
</style>
