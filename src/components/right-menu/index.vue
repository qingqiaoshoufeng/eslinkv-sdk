<template lang="pug">
#right-menu.right-menu.pos-f(
	ref="rightMenu",
	@contextmenu.stop.prevent,
	v-click-outside="hideRightMenu")
	ul.list
		li(@click="handleZIndexTop")
			i-icon(type="md-arrow-round-up")
			span 置顶
		li(@click="handleZIndexBottom")
			i-icon(type="md-arrow-round-down")
			span 置底
		li(@click="handleZIndex(1)")
			i-icon(type="ios-arrow-up")
			span 上移一层
		li(@click="handleZIndex(-1)", :class="{ disabled: zIndex === 1 }")
			i-icon(type="ios-arrow-down")
			span 下移一层
	ul.list
		li(@click="")
			i-icon(type="md-heart-outline")
			span 收藏
	ul.list
		li(@click="hideWidget")
			i-icon(type="md-eye-off")
			span 隐藏
		li(@click="handleLock")
			i-icon(:type="isLock ? 'md-lock' : 'md-unlock'")
			span {{ isLock ? '解锁' : '锁定' }}
	ul.list
		li(@click="copyWidget")
			i-icon(type="ios-copy")
			span 复制
		li(@click="handleSync")
			i-icon(type="md-refresh")
			span 刷新
		li(@click="deleteWidget")
			i-icon(type="md-trash")
			span 删除
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import instance from '../../store/instance.store'
import { Icon } from 'view-design'
import Editor from '@/core/Editor'
import ClickOutside from 'vue-click-outside'

@Component({
	components: {
		'i-icon': Icon,
	},
	directives: { ClickOutside },
})
export default class rightMenu extends Vue {
	instance = instance.state
	isLock = false
	zIndex = 10
	minZIndex = 0
	maxZIndex = 0
	editor: Editor = Editor.Instance()
	handleSync(): void {
		this.editor.refreshWidget()
		this.hideRightMenu()
	}

	handleZIndex(num: number): void {
		if (this.zIndex === 1 && num === -1) return
		this.zIndex += num
		this.editor.currentWidget.config.layout.zIndex = this.zIndex
		this.hideRightMenu()
	}

	handleZIndexTop(): void {
		this.zIndex = this.maxZIndex
		this.editor.currentWidget.config.layout.zIndex = this.maxZIndex
		this.hideRightMenu()
	}

	handleZIndexBottom(): void {
		this.zIndex = this.minZIndex
		this.editor.currentWidget.config.layout.zIndex = this.minZIndex
		this.hideRightMenu()
	}

	hideWidget(): void {
		const widget = this.editor.currentWidget.config.widget
		widget.hide = !widget.hide
		this.handleUnActive()
	}

	deleteWidget(): void {
		this.$Modal.confirm({
			title: '提示',
			content: '是否删除当前组件？',
			onOk: () => {
				const id = this.editor.currentWidgetId
				this.editor.deleteWidget(id)
				this.hideRightMenu()
			},
			onCancel: () => {
				this.hideRightMenu()
			},
		})
	}

	copyWidget(): void {
		this.editor.copyWidget()
		this.handleUnActive()
	}

	hideRightMenu(): void {
		const rightMenu = document.getElementById('right-menu')
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
	width: 132px;
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

		li {
			position: relative;
			display: flex;
			align-items: center;
			height: 26px;
			padding: 0 12px 0 15px;
			cursor: pointer;

			&:hover {
				background: #393e49;
			}

			span {
				margin-left: 4px;
				user-select: none;
			}
		}
	}

	&.active {
		pointer-events: auto;
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
