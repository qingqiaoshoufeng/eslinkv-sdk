<template lang="pug">
#right-menu.right-menu.pos-f(ref="rightMenu", @contextmenu.stop.prevent)
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
import { Vue, Component, Watch } from 'vue-property-decorator'
import instance from '../../store/instance.store'
import { Icon } from 'view-design'
import Editor from '@/core/Editor'

@Component({
	components: {
		'i-icon': Icon,
	},
})
export default class rightMenu extends Vue {
	instance = instance.state
	isLock = false
	zIndex = 10
	minZIndex = 0
	maxZIndex = 0
	editor = Editor.Instance()
	handleSync() {
		this.instance.kanboard.$refs[`${this.editor.chooseWidgetId}`][0]
			.$children[0].updateKey++
		this.hideRightMenu()
	}

	handleZIndex(num) {
		if (this.zIndex === 1 && num === -1) return
		this.zIndex += num
		this.editor.screenWidgets[
			this.editor.chooseWidgetId
		].config.layout.zIndex = this.zIndex
		this.hideRightMenu()
	}

	handleZIndexTop() {
		this.zIndex = this.maxZIndex
		this.editor.screenWidgets[
			this.editor.chooseWidgetId
		].config.layout.zIndex = this.maxZIndex
		this.hideRightMenu()
	}

	handleZIndexBottom() {
		this.zIndex = this.minZIndex
		this.editor.screenWidgets[
			this.editor.chooseWidgetId
		].config.layout.zIndex = this.minZIndex
		this.hideRightMenu()
	}

	hideWidget() {
		const widget = this.editor.screenWidgets[this.editor.chooseWidgetId]
			.config.widget
		widget.hide = !widget.hide
		this.handleUnActive()
	}

	deleteWidget() {
		this.$Modal.confirm({
			title: '提示',
			content: '是否删除当前组件？',
			onOk: () => {
				const id = this.editor.chooseWidgetId
				this.editor.screen.deleteWidget(id)
				this.handleUnActive()
			},
			onCancel: () => {
				this.hideRightMenu()
			},
		})
	}

	copyWidget() {
		this.editor.screen.copyWidget()
		this.handleUnActive()
	}
	
	hideRightMenu() {
		const rightMenu = document.getElementById('right-menu')
		rightMenu.classList.remove('active')
	}

	handleUnActive() {
		this.editor.unChooseWidget()
	}

	handleLock() {
		this.isLock = !this.isLock
		this.editor.screenWidgets[
			this.editor.chooseWidgetId
		].config.widget.locked = this.isLock
		this.hideRightMenu()
	}

	@Watch('editor.chooseWidgetId')
	chooseIdChange(val) {
		if (!val) return
		this.isLock = this.editor.screenWidgets[val].config.widget.locked
		this.zIndex = this.editor.screenWidgets[val].config.layout.zIndex
		let max = 0
		let min = 9999
		for (const key in this.editor.screenWidgets) {
			max = Math.max(
				this.editor.screenWidgets[key].config.layout.zIndex,
				max,
			)
			min = Math.min(
				this.editor.screenWidgets[key].config.layout.zIndex,
				min,
			)
		}
		max++
		min--
		this.maxZIndex = max
		this.minZIndex = Math.max(1, min)
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
