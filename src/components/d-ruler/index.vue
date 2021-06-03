<template lang="pug">
.d-ruler-wrapper.pos-r
	i-icon.pos-a.d-ruler-guide-visible.pointer.z-index-999.text-center(
		:type="editor.guideVisible ? 'ios-eye-off-outline' : 'ios-eye-outline'",
		@click="editor.guideVisible = !editor.guideVisible")
	x-line
	y-line
	.d-ruler-content(@mousemove="rulerContentMouseMove", :id="editor.contentId")
		.content-body.pos-a(:id="editor.dragId", :style="editor.rulerStyle")
			slot
</template>
<script lang="ts">
import xLine from './xLine.vue'
import yLine from './yLine.vue'
import { Component, Vue } from 'vue-property-decorator'
import { Icon } from 'view-design'
import { rulerContentMouseMove } from '@/events'
import Editor from '@/core/Editor'
@Component({
	components: {
		xLine,
		yLine,
		'i-icon': Icon,
	},
})
export default class DRuler extends Vue {
	editor = Editor.Instance()
	rulerContentMouseMove = rulerContentMouseMove

	windowResize(): void {
		const id = this.editor.dragId
		const dragContent: any = document.getElementById(id).firstChild
		this.editor.width = dragContent.scrollWidth
		this.editor.height = dragContent.scrollHeight
		this.editor.resetZoom()
	}

	beforeDestroy(): void {
		window.removeEventListener('resize', this.windowResize)
		document.documentElement.removeEventListener('keydown', this.keydown)
		document.documentElement.removeEventListener('keyup', this.keyup)
		document.documentElement.removeEventListener('mouseup', this.mouseUp)
		document.documentElement.removeEventListener(
			'mousedown',
			this.mouseDown,
		)
		document.documentElement.removeEventListener(
			'mousemove',
			this.mouseMove,
		)
		document.documentElement.removeEventListener('wheel', this.wheel)
	}

	mounted(): void {
		window.addEventListener('resize', this.windowResize)
		document.documentElement.addEventListener('keydown', this.keydown)
		document.documentElement.addEventListener('keyup', this.keyup)
		document.documentElement.addEventListener('mouseup', this.mouseUp)
		document.documentElement.addEventListener('mousedown', this.mouseDown)
		document.documentElement.addEventListener('mousemove', this.mouseMove)
		document.documentElement.addEventListener('wheel', this.wheel)
	}

	public mouseUp(e: any): void {
		if (this.editor.eve.contentDrag) {
			this.editor.eve.contentDrag = false
		}
	}

	public mouseDown(e: any): void {
		// 判断是否为鼠标左键被按下
		if (e.buttons !== 1 || e.which !== 1) return
		this.editor.eve.startX = e.clientX
		this.editor.eve.startY = e.clientY
		if (this.editor.eve.contentMove) {
			this.editor.eve.contentDrag = true
		}
	}

	public mouseMove(e: any): void {
		const { clientX, clientY } = e
		this.editor.eve.clientX = clientX
		this.editor.eve.clientY = clientY
		if (this.editor.eve.contentDrag) {
			if (!this.editor.eve.startX) {
				this.editor.eve.clientX = clientX
				this.editor.eve.clientY = clientY
			}
			this.editor.eve.contentScrollLeft = Math.ceil(
				clientX - this.editor.eve.startX,
			)
			this.editor.eve.contentX += this.editor.eve.contentScrollLeft
			this.editor.eve.contentScrollTop = Math.ceil(
				clientY - this.editor.eve.startY,
			)
			this.editor.eve.contentY += this.editor.eve.contentScrollTop
			this.editor.eve.startX = clientX
			this.editor.eve.startY = clientY
			this.editor.eve.initRuler({
				width: this.editor.width,
				height: this.editor.height,
				type: 'x',
			})
			this.editor.eve.initRuler({
				width: this.editor.width,
				height: this.editor.height,
				type: 'y',
			})
		}
	}

	/* 滚动画布 */
	public wheel(e: any): void {
		if (e.ctrlKey) {
			e.preventDefault()
			e.stopPropagation()
			if (e.wheelDelta > 0) {
				this.editor.zoomIn()
			} else {
				this.editor.zoomOut()
			}
		} else {
			if (e.shiftKey) {
				this.editor.eve.contentX += e.wheelDelta > 0 ? 10 : -10
			} else {
				this.editor.eve.contentY += e.wheelDelta > 0 ? 10 : -10
			}
		}
		this.editor.eve.initRuler({
			width: this.editor.width,
			height: this.editor.height,
			type: 'x',
		})
		this.editor.eve.initRuler({
			width: this.editor.width,
			height: this.editor.height,
			type: 'y',
		})
	}

	keyup(e: any): void {
		this.editor.eve.contentMove = false
		document.getElementById(this.editor.contentId).style.cursor = 'auto'
		// if (e.keyCode === 8 || e.keyCode === 46) {
		// 	if (!Vue.prototype.$screen.chooseWidgetId || event.state.inputFocus) return
		// 	Vue.prototype.$Modal.confirm({
		// 		title: '提示',
		// 		content: '是否删除当前组件？',
		// 		onOk: () => {
		// 			const id = Vue.prototype.$screen.chooseWidgetId
		// 			Vue.delete(Vue.prototype.$screen.screenWidgets, id)
		// 			Vue.prototype.$screen.unChooseWidget()
		// 		},
		// 	})
		// }
	}

	keydown(e: any): void {
		if (
			(e.ctrlKey === true || e.metaKey === true) &&
			(e.which === 189 ||
				e.which === 187 ||
				e.which === 173 ||
				e.which === 61 ||
				e.which === 107 ||
				e.which === 109)
		) {
			e.preventDefault()
		}
		if (e.keyCode === 32) {
			this.editor.eve.contentMove = true
			document.getElementById(this.editor.contentId).style.cursor = 'grab'
		}
	}
}
</script>

<style lang="scss">
.d-ruler-guide-visible {
	position: absolute;
	left: 0;
	width: 18px;
	height: 18px;
	line-height: 18px;
	color: var(--white);
	background-color: #111;
}

.d-ruler {
	&-wrapper {
		top: 0;
		left: 0;
		z-index: 1;
		width: 100%;
		height: calc(100% - 32px);
		overflow: hidden;
		user-select: none;
	}

	&-content {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		width: 100%;
		height: 100%;
		overflow: hidden;

		&.drag {
			cursor: grab;
		}

		.content-body {
			top: 0;
			left: 0;
			margin-top: 1px;
			overflow: visible;
			border: 18px transparent solid;
			transition: all 0.3s;
		}
	}
}
</style>
