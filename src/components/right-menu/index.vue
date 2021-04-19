<template lang="pug">
ul.right-menu.pos-f(ref="rightMenu", @contextmenu.stop.prevent)
	li
		span 层叠
		span.suffix 当前 {{ zIndex }}
		ul.sub-menu.pos-a
			li(@click="handleZIndex(1)") 上移一层
			li(@click="handleZIndex(-1)", :class="{ disabled: zIndex === 1 }") 下移一层
			li(@click="handleZIndexTop") 置顶
			li(@click="handleZIndexBottom") 置底
	li(@click="copyWidget") 复制
	li(@click="handleUnActive") 取消选择
	li(@click="handleLock") {{ isLock ? '解锁' : '锁定' }}
	li(@click="hideWidget") 隐藏
	li(@click="deleteWidget") 删除
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import platform from '../../store/platform.store'
import copy from 'fast-copy'
import { uuid } from '../../utils/index'

@Component
export default class rightMenu extends Vue {
	platform = platform.state
	isLock = false
	zIndex = 10
	minZIndex = 0
	maxZIndex = 0

	handleZIndex(num) {
		if (this.zIndex === 1 && num === -1) return
		this.zIndex += num
		this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.layout.zIndex = this.zIndex
	}

	handleZIndexTop() {
		this.zIndex = this.maxZIndex
		this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.layout.zIndex = this.maxZIndex
	}

	handleZIndexBottom() {
		this.zIndex = this.minZIndex
		this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.layout.zIndex = this.minZIndex
	}

	hideWidget() {
		const widget = this.platform.widgetAdded[this.platform.chooseWidgetId]
			.config.widget
		widget.hide = !widget.hide
		this.$emit('deactivateWidget', this.platform.chooseWidgetId)
	}

	deleteWidget() {
		this.$Modal.confirm({
			title: '提示',
			content: '是否删除当前组件？',
			onOk: () => {
				const id = this.platform.chooseWidgetId
				platform.actions.unChooseWidget()
				this.$delete(this.platform.widgetAdded, id)
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
	}

	handleUnActive() {
		platform.actions.unChooseWidget()
	}

	handleLock() {
		this.isLock = !this.isLock
		this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.widget.locked = this.isLock
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
	width: 120px;
	padding: 5px 0;
	font-size: 12px;
	text-align: left;
	pointer-events: none;
	background-color: var(--white);
	filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.15));
	border-radius: 5px;
	opacity: 0;
	transition: transform 0.2s, opacity 0.2s;
	transform: translateY(10px);

	.sub-menu {
		top: -5px;
		left: calc(100% + 5px);
		padding: 5px 0;
		pointer-events: none;
		background-color: var(--white);
		filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.15));
		border-radius: 5px;
		opacity: 0;
		transition: transform 0.2s, opacity 0.2s;
		transform: translateY(-10px);

		&::before {
			position: absolute;
			top: 5px;
			left: -7px;
			font-size: 14px;
			color: var(--white);
			content: '\23F4';
		}
	}

	li {
		position: relative;
		display: flex;
		justify-content: space-between;
		padding: 0 15px;
		line-height: 30px;
		white-space: nowrap;
		list-style: none;

		.suffix {
			font-size: 0.9em;
			opacity: 0.8;
		}

		&.disabled {
			pointer-events: none;
			opacity: 0.5;
		}

		& > .sub-menu:hover,
		&:hover > .sub-menu {
			pointer-events: auto;
			opacity: 1;
			transition: transform 0.2s 0.2s, opacity 0.2s 0.2s;
			transform: translateY(0);
		}
	}

	li:hover {
		cursor: pointer;
		background-color: #dcdcdc;
	}

	&.active {
		pointer-events: auto;
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
