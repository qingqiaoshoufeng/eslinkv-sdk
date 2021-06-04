<template lang="pug">
.d-ruler-wrapper.pos-r
	i-icon.pos-a.d-ruler-guide-visible.pointer.z-index-999.text-center(
		:type="editor.guideVisible ? 'ios-eye-off-outline' : 'ios-eye-outline'",
		@click="editor.guideVisible = !editor.guideVisible")
	.d-ruler-content(:id="editor.contentId")
		.content-body.pos-a(:id="editor.dragId", :style="editor.rulerStyle")
			slot
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Icon } from 'view-design'
import Editor from '@/core/Editor'
@Component({
	components: {
		'i-icon': Icon,
	},
})
export default class DRuler extends Vue {
	editor = Editor.Instance()

	windowResize(): void {
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
		if (this.editor.widgetMove) {
			this.editor.widgetMove = false
		}
		if (this.editor.eve.kuangMove) {
			document.getElementById('d-kuang').style.display = 'none'
			this.editor.eve.kuangMove = false
			const startPointerX = Vue.prototype.$ruler.getActualPointerX(
				this.editor.eve.startX,
			)
			const startPointerY = Vue.prototype.$ruler.getActualPointerY(
				this.editor.eve.startY,
			)
			const endPointerX = Vue.prototype.$ruler.getActualPointerX(
				e.clientX,
			)
			const endPointerY = Vue.prototype.$ruler.getActualPointerY(
				e.clientY,
			)
			if (startPointerX === endPointerX || startPointerY === endPointerY)
				return
			const minPointerX = Math.min(startPointerX, endPointerX)
			const minPointerY = Math.min(startPointerY, endPointerY)
			const maxPointerX = Math.max(startPointerX, endPointerX)
			const maxPointerY = Math.max(startPointerY, endPointerY)
			this.editor.screen.chooseWidgetArray = []
			Object.values(this.editor.screen.screenWidgets).forEach(v => {
				// 只能框选当前场景下的组件
				if (v.scene === this.editor.screen.sceneIndex) {
					const widgetStartX = v.config.layout.position.left
					const widgetStartY = v.config.layout.position.top
					const widgetEndX =
						v.config.layout.position.left +
						v.config.layout.size.width
					const widgetEndY =
						v.config.layout.position.top +
						v.config.layout.size.height
					if (
						minPointerX < widgetStartX &&
						widgetStartX < maxPointerX &&
						minPointerY < widgetStartY &&
						widgetStartY < maxPointerY &&
						minPointerX < widgetEndX &&
						widgetEndX < maxPointerX &&
						minPointerY < widgetEndY &&
						widgetEndY < maxPointerY
					) {
						this.editor.screen.chooseWidgetArray = [
							...this.editor.screen.chooseWidgetArray,
							v.id,
						]
					}
				}
			})
			let minLeft = null,
				maxLeft = null,
				width = 0,
				height = 0,
				minTop = null,
				maxTop = null
			if (this.editor.screen.chooseWidgetArray.length === 1) {
				this.editor.screen.chooseWidgetId = this.editor.screen.chooseWidgetArray[0]
				this.editor.screen.chooseWidgetArray = []
			} else {
				this.editor.screen.chooseWidgetArray.map(item => {
					const m = this.editor.screen.screenWidgets[item]
					if (minLeft === null) {
						minLeft = m.config.layout.position.left
					}
					if (maxLeft === null) {
						maxLeft = m.config.layout.position.left
						width = m.config.layout.size.width
					}
					if (minTop === null) {
						minTop = m.config.layout.position.top
					}
					if (maxTop === null) {
						maxTop = m.config.layout.position.top
						height = m.config.layout.size.height
					}
					if (minLeft > m.config.layout.position.left)
						minLeft = m.config.layout.position.left
					if (maxLeft < m.config.layout.position.left) {
						maxLeft = m.config.layout.position.left
						width = m.config.layout.size.width
					}
					if (minTop > m.config.layout.position.top)
						minTop = m.config.layout.position.top
					if (maxTop < m.config.layout.position.top) {
						maxTop = m.config.layout.position.top
						height = m.config.layout.size.height
					}
				})
				this.editor.screen.chooseWidgetArrayConfig.left = minLeft
				this.editor.screen.chooseWidgetArrayConfig.top = minTop
				this.editor.screen.chooseWidgetArrayConfig.width =
					width + (maxLeft - minLeft)
				this.editor.screen.chooseWidgetArrayConfig.height =
					height + (maxTop - minTop)
			}
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
		if (!this.editor.eve.widgetMove) {
			this.editor.unChooseWidget()
		}
		if (
			!this.editor.eve.contentMove &&
			!this.editor.eve.widgetDrag &&
			!this.editor.eve.widgetMove
		) {
			this.editor.eve.kuangMove = true
			let kuang = document.getElementById('d-kuang')
			if (!kuang) {
				kuang = document.createElement('div')
				kuang.style.cssText =
					'position: absolute;width: 0;height: 0;margin: 0;padding: 0;border: 1px solid rgb(36, 145, 247);background-color: rgba(0, 132, 255, 0.15);z-index: 1000;opacity: 0.6;display: none;pointer-events: none;'
				kuang.id = 'd-kuang'
				document.body.appendChild(kuang)
			}
			kuang.style.left = this.editor.eve.startX + 'px'
			kuang.style.top = this.editor.eve.startY + 'px'
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
			this.editor.eve.offsetX += this.editor.eve.contentScrollLeft
			this.editor.eve.contentScrollTop = Math.ceil(
				clientY - this.editor.eve.startY,
			)
			this.editor.eve.offsetY += this.editor.eve.contentScrollTop
			console.log(this.editor.eve.offsetY, this.editor.eve.offsetX)
			this.editor.ruler.draw({
				offsetY: this.editor.eve.offsetY,
				offsetX: this.editor.eve.offsetX,
			})
			this.editor.eve.startX = clientX
			this.editor.eve.startY = clientY
		}
		if (this.editor.eve.kuangMove) {
			e.stopPropagation()
			const _x = e.clientX
			const _y = e.clientY
			const selDiv = document.getElementById('d-kuang')
			selDiv.style.display = 'block'
			selDiv.style.left = Math.min(_x, this.editor.eve.startX) + 'px'
			selDiv.style.top = Math.min(_y, this.editor.eve.startY) + 'px'
			selDiv.style.width = Math.abs(_x - this.editor.eve.startX) + 'px'
			selDiv.style.height = Math.abs(_y - this.editor.eve.startY) + 'px'
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
				this.editor.eve.offsetX += e.wheelDelta > 0 ? 10 : -10
			} else {
				this.editor.eve.offsetY += e.wheelDelta > 0 ? 10 : -10
			}
		}
		this.editor.ruler.draw({
			offsetY: this.editor.eve.offsetY,
			offsetX: this.editor.eve.offsetX,
			zoom: this.editor.eve.zoom,
		})
	}

	keyup(e: any): void {
		this.editor.eve.contentMove = false
		document.getElementById(this.editor.contentId).style.cursor = 'auto'
		// if (e.keyCode === 8 || e.keyCode === 46) {
		// 	if (!this.editor.screen.chooseWidgetId || this.editor.eve.inputFocus) return
		// 	Vue.prototype.$Modal.confirm({
		// 		title: '提示',
		// 		content: '是否删除当前组件？',
		// 		onOk: () => {
		// 			const id = this.editor.screen.chooseWidgetId
		// 			Vue.delete(this.editor.screen.screenWidgets, id)
		// 			this.editor.screen.unChooseWidget()
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
