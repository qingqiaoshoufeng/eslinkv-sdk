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
import platform from '../../store/platform.store'
import instance from '../../store/instance.store'
import copy from 'fast-copy'
import { uuid } from '../../utils/index'
import { Icon } from 'view-design'

@Component({
	components: {
		'i-icon': Icon,
	},
})
export default class rightMenu extends Vue {
	platform = platform.state
	instance = instance.state
	isLock = false
	zIndex = 10
	minZIndex = 0
	maxZIndex = 0

	handleSync() {
		this.instance.kanboard.$refs[
			`widget_${this.platform.chooseWidgetId}`
		][0].$children[0].updateKey++
		this.hideRightMenu()
	}

	handleZIndex(num) {
		if (this.zIndex === 1 && num === -1) return
		this.zIndex += num
		this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.layout.zIndex = this.zIndex
		this.hideRightMenu()
	}

	handleZIndexTop() {
		this.zIndex = this.maxZIndex
		this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.layout.zIndex = this.maxZIndex
		this.hideRightMenu()
	}

	handleZIndexBottom() {
		this.zIndex = this.minZIndex
		this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.layout.zIndex = this.minZIndex
		this.hideRightMenu()
	}

	hideWidget() {
		const widget = this.platform.widgetAdded[this.platform.chooseWidgetId]
			.config.widget
		widget.hide = !widget.hide
		this.handleUnActive()
	}

	deleteWidget() {
		this.$Modal.confirm({
			title: '提示',
			content: '是否删除当前组件？',
			onOk: () => {
				const id = this.platform.chooseWidgetId
				this.$delete(this.platform.widgetAdded, id)
				this.handleUnActive()
			},
			onCancel: () => {
				this.hideRightMenu()
			},
		})
	}

	copyWidget() {
		const copyId = this.platform.chooseWidgetId
		const widget = this.platform.widgetAdded[copyId]
		if (!widget) return
		const copiedWidget = copy(widget)
		const id = uuid()
		copiedWidget.id = id
		this.initCopyWidget(id, copiedWidget)
	}

	initCopyWidget(id, widget, makeOffset = true) {
		const config = widget.config
		config.widget.id = id
		const layout = config.layout
		if (makeOffset) {
			layout.position.left += 10
			layout.position.top += 10
		}
		platform.actions.setWidgetsAddedItem(
			id,
			widget.type,
			widget.config,
			widget.scene,
		)
		this.handleUnActive()
	}

	hideRightMenu() {
		const rightMenu = document.getElementById('right-menu')
		rightMenu.classList.remove('active')
	}

	handleUnActive() {
		platform.actions.unChooseWidget()
	}

	handleLock() {
		this.isLock = !this.isLock
		this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.widget.locked = this.isLock
		this.hideRightMenu()
	}

	@Watch('platform.chooseWidgetId')
	chooseIdChange(val) {
		if (!val) return
		this.isLock = this.platform.widgetAdded[val].config.widget.locked
		this.zIndex = this.platform.widgetAdded[val].config.layout.zIndex
		let max = 0
		let min = 9999
		for (const key in this.platform.widgetAdded) {
			max = Math.max(
				this.platform.widgetAdded[key].config.layout.zIndex,
				max,
			)
			min = Math.min(
				this.platform.widgetAdded[key].config.layout.zIndex,
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
