<template lang="pug">
#widget-right-menu.right-menu.pos-f(
	@contextmenu.stop.prevent,
	v-click-outside="hideRightMenu")
	ul.list
		item-card(@click="handleZIndexTop")
			i-icon(type="md-arrow-round-up")
			span 置顶
		item-card(@click="handleZIndexBottom")
			i-icon(type="md-arrow-round-down")
			span 置底
	//ul.list
	//	item-card(@click="")
	//		i-icon(type="md-heart-outline")
	//		span 收藏
	ul.list(v-if="isGroup")
		item-card(@click="handleRelieveGroup")
			i-icon(type="md-apps")
			span 取消组合
	ul.list
		item-card(@click="hideWidget")
			i-icon(type="md-eye-off")
			span 隐藏
		item-card(@click="handleLock")
			i-icon(:type="isLock ? 'md-lock' : 'md-unlock'")
			span {{ isLock ? '解锁' : '锁定' }}
	ul.list
		item-card(@click="copyWidget")
			i-icon(type="ios-copy")
			span 复制
		item-card(@click="handleSync")
			i-icon(type="md-refresh")
			span 刷新
		item-card(@click="deleteWidget")
			i-icon(type="md-trash")
			span 删除
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Icon } from 'view-design'
import Editor from '@/core/Editor'
import ClickOutside from 'vue-click-outside'
import ItemCard from '@/vue2/components/right-menu/item-card.vue'

@Component({
	components: {
		'i-icon': Icon,
		ItemCard,
	},
	directives: { ClickOutside },
})
export default class rightMenu extends Vue {
	isLock = false
	editor: Editor = Editor.Instance()

	get isGroup(): boolean {
		if (this.editor.currentWidget) {
			return this.editor.currentWidget.widgetType === 'group'
		}
		return false
	}

	handleRelieveGroup(): void {
		this.editor.relieveWidgetGroup()
		this.hideRightMenu()
		this.handleUnActive()
	}

	handleSync(): void {
		this.editor.refreshWidget()
		this.hideRightMenu()
	}

	handleZIndexTop(): void {
		this.editor.currentWidget.config.layout.zIndex = this.editor.currentMaxZIndex
		this.hideRightMenu()
	}

	handleZIndexBottom(): void {
		this.editor.currentWidget.config.layout.zIndex = this.editor.currentMinZIndex
		this.hideRightMenu()
	}

	hideWidget(): void {
		const widget = this.editor.currentWidget.config.widget
		widget.hide = !widget.hide
		this.hideRightMenu()
		this.handleUnActive()
	}

	deleteWidget(): void {
		const id = this.editor.currentWidgetId
		if (this.editor.currentSceneIndex === -1) {
			this.$Modal.confirm({
				title: '是否删除当前组件？',
				content: '该组件将自动进入回收站！',
				onOk: () => {
					this.editor.deleteWidget(id)
					this.hideRightMenu()
				},
				onCancel: () => {
					this.hideRightMenu()
				},
			})
		} else {
			this.$Modal.confirm({
				title: '是否删除当前组件？',
				content: '该组件将自动进入回收站！',
				onOk: () => {
					this.editor.deleteWidget(id)
					this.hideRightMenu()
				},
				onCancel: () => {
					this.hideRightMenu()
				},
			})
		}
	}

	copyWidget(): void {
		this.editor.copyWidget()
		this.handleUnActive()
		this.hideRightMenu()
	}

	hideRightMenu(): void {
		const rightMenu = document.getElementById('widget-right-menu')
		rightMenu.classList.remove('active')
	}

	handleUnActive(): void {
		this.editor.unSelectWidget()
	}

	handleLock(): void {
		this.isLock = !this.isLock
		this.editor.currentWidget.config.widget.locked = this.isLock
		this.hideRightMenu()
	}
}
</script>
<style lang="scss">
.right-menu {
	z-index: 2;
	font-size: 12px;
	color: #bfbfbf;
	text-align: left;
	pointer-events: none;
	background: #2d2f38;
	opacity: 0;
	transition: transform 0.2s, opacity 0.2s;
	transform: translateY(10px);

	.list {
		border-bottom: 1px solid #22242b;

		&:last-child {
			border-bottom: none;
		}
	}

	&.active {
		pointer-events: auto;
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
