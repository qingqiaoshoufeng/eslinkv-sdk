<template lang="pug">
.d-ruler-wrapper-x(
	@mouseenter="showHelp = true",
	@mouseleave="showHelp = false",
	@mousedown="rulerLineMouseDown($event, 'v', $route.params.id)",
	@mouseup="rulerLineMouseUp($event, 'v', $route.params.id)")
	canvas#ruler-x.pos-a(width="9999", height="18")
	.d-ruler-mouse-x.pos-a(
		:style="`transform: translateX(${event.clientX - ruler.size - ruler.xRoomL1 - ruler.xRoomL2}px)`",
		v-if="showHelp")
		.num {{ site }}
</template>
<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import platform from '../../store/platform.store'
import event from '../../store/event.store'
import ruler from '../../store/ruler.store'
import { rulerLineMouseUp, rulerLineMouseDown } from '@/events'

let i = 0
let loadImg = false
const bgImg = new Image()

@Component
export default class XLine extends Vue {
	platform = platform.state
	event = event.state
	ruler = ruler.state
	showHelp = false
	canvas: null
	context = null
	rulerLineMouseDown = rulerLineMouseDown
	rulerLineMouseUp = rulerLineMouseUp

	get site() {
		return ruler.actions.site('v')
	}

	@Watch('ruler.zoom')
	zoomChange() {
		this.init()
	}

	@Watch('ruler.contentX')
	contentXChange() {
		this.init()
	}

	translateAnimation(num) {
		const animation = requestAnimationFrame(() =>
			this.translateAnimation(num),
		)
		if (i === num) {
			cancelAnimationFrame(animation)
			i = 0
		}
		this.handleTranslate(1)
		if (num > 0) i++
		if (num < 0) i--
	}

	handleTranslate(num) {
		this.clearRulerCanvas()
		this.context.translate(num, 0)
		this.init()
	}

	clearRulerCanvas() {
		const t = this.context.getTransform()
		this.context.clearRect(
			-t.e,
			0,
			// @ts-ignore
			this.canvas.width - t.e,
			// @ts-ignore
			this.canvas.height,
		)
	}

	initDraw() {
		this.clearRulerCanvas()
		const t = this.context.getTransform()
		let x = 0
		// @ts-ignore
		while (x < this.canvas.width - t.e) {
			this.context.drawImage(bgImg, x, 0)
			this.context.fillText(~~(x / this.ruler.zoom), x + 4, 10)
			x = x + this.ruler.stepLength
		}

		if (t.e > 0) {
			let xe = 0
			while (xe < t.e) {
				xe = xe + this.ruler.stepLength
				this.context.drawImage(bgImg, -xe, 0)
				this.context.fillText(
					xe === 0 ? '0' : -~~(xe / this.ruler.zoom),
					-xe + 2,
					10,
				)
			}
		}
	}

	/**
	 * @description
	 *
	 * 画布高度 * （1-缩放比例）      ===》2边缩放距离
	 * 2边缩放距离 / 2               ===》单边缩放距离
	 * 单边缩放距离 + 面板拖动距离     ===》0点距离左侧边界像素值
	 */
	init() {
		this.context.translate(
			(this.platform.width * (1 - this.ruler.zoom)) / 2 +
				this.ruler.contentX -
				this.ruler.guideStartX,
			0,
		)
		this.ruler.guideStartX =
			(this.platform.width * (1 - this.ruler.zoom)) / 2 +
			this.ruler.contentX
		if (loadImg) {
			this.initDraw()
		} else {
			bgImg.src =
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAASCAIAAACW8RrQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3OEUyMEM3NzkyMTIxMUVCQkZGREJCREZEQzRBQUVFQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3OEUyMEM3ODkyMTIxMUVCQkZGREJCREZEQzRBQUVFQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjc4RTIwQzc1OTIxMjExRUJCRkZEQkJERkRDNEFBRUVDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjc4RTIwQzc2OTIxMjExRUJCRkZEQkJERkRDNEFBRUVDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+r9C/twAAAENJREFUeNpilJBWYRh8gElSXHQwOothUIJRZ406a9RZo84adRY9nIW/aqKd7BAJrYEKHjTZ0SRPCmA0NLIchM4CCDAAtx4DyLnOl1UAAAAASUVORK5CYII='
			bgImg.onload = () => {
				loadImg = true
				this.initDraw()
			}
		}
	}

	mounted() {
		// @ts-ignore
		this.canvas = document.getElementById('ruler-x')
		// @ts-ignore
		this.context = this.canvas.getContext('2d')
		this.context.font = '10px sans-serif'
		this.context.fillStyle = '#999'
		this.init()
	}
}
</script>
<style lang="scss" scoped>
canvas {
	left: 0;
	height: 100%;
}

.d-ruler-wrapper-x {
	position: absolute;
	top: 0;
	left: 18px;
	z-index: 9;
	width: calc(100% - 18px);
	height: 18px;
	box-shadow: #111 0 0 1px;
}

.d-ruler-mouse-x {
	top: 0;
	left: 0;
	z-index: 30;
	width: 0;
	height: 9999px;
	pointer-events: none;
	border-left: 1px dashed var(--lineRed);

	.num {
		position: absolute;
		top: 2px;
		left: 3px;
		padding: 4px;
		font-size: 12px;
		line-height: 12px;
		color: var(--white);
		background: var(--lineRed);
	}
}
</style>
