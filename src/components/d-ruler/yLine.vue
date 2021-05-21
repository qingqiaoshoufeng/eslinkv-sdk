<template lang="pug">
.d-ruler-wrapper-y(
	@mouseenter="showHelp = true",
	@mouseleave="showHelp = false",
	@mousedown="rulerLineMouseDown($event, 'h', $route.params.id)",
	@mouseup="rulerLineMouseUp($event, 'h', $route.params.id)")
	canvas#ruler-v.pos-a(width="18", height="9999")
	.d-ruler-mouse-y.pos-a(
		:style="`transform: translateY(${event.clientY - ruler.size - ruler.yRoom}px)`",
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
export default class YLine extends Vue {
	platform = platform.state
	event = event.state
	ruler = ruler.state
	showHelp = false
	canvas = null
	context = null
	rulerLineMouseDown = rulerLineMouseDown
	rulerLineMouseUp = rulerLineMouseUp

	get site() {
		return ruler.actions.site('h')
	}

	@Watch('ruler.zoom')
	zoomChange() {
		this.init()
	}

	@Watch('ruler.contentY')
	contentXChange() {
		this.init()
	}

	@Watch('platform.height')
	heightChange() {
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
		this.context.translate(0, num)
		this.init()
	}

	clearRulerCanvas() {
		const t = this.context.getTransform()
		this.context.clearRect(
			-t.e,
			0,
			// @ts-ignore
			this.canvas.width,
			// @ts-ignore
			this.canvas.height - t.e,
		)
	}

	initDraw() {
		this.clearRulerCanvas()
		const t = this.context.getTransform()
		let x = 0
		while (x < this.canvas.height - t.f) {
			this.context.save()
			this.context.drawImage(bgImg, 0, x)
			this.context.translate(10, x)
			this.context.rotate(-Math.PI / 2)
			const num = ~~(x / this.ruler.zoom)
			this.context.fillText(num, -num.toString().length * 8, 0)
			x = x + this.ruler.stepLength
			this.context.restore()
		}

		if (t.f > 0) {
			let xe = 0
			while (xe < t.f) {
				this.context.save()
				xe = xe + this.ruler.stepLength
				this.context.drawImage(bgImg, 0, -xe)
				this.context.translate(10, -xe + 28)
				this.context.rotate(-Math.PI / 2)
				this.context.fillText(~~-(xe / this.ruler.zoom), 2, 0)
				this.context.restore()
			}
		}
	}

	/**
	 * @description
	 *
	 * 画布高度 * （1-缩放比例）      ===》2边缩放距离
	 * 2边缩放距离 / 2               ===》单边缩放距离
	 * 单边缩放距离 + 面板拖动距离     ===》0点距离上侧边界像素值
	 */
	init() {
		this.context.translate(
			0,
			(this.platform.height * (1 - this.ruler.zoom)) / 2 +
				this.ruler.contentY -
				this.ruler.guideStartY,
		)
		this.ruler.guideStartY =
			(this.platform.height * (1 - this.ruler.zoom)) / 2 +
			this.ruler.contentY
		if (loadImg) {
			this.initDraw()
		} else {
			bgImg.src =
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAyCAIAAADeABw2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxQkM4MjEwRjkyMTMxMUVCOTlBQUQyOTQ0REY2ODNDMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxQkM4MjExMDkyMTMxMUVCOTlBQUQyOTQ0REY2ODNDMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFCQzgyMTBEOTIxMzExRUI5OUFBRDI5NDRERjY4M0MxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjFCQzgyMTBFOTIxMzExRUI5OUFBRDI5NDRERjY4M0MxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2HR8RgAAAE5JREFUeNpikZBWkRQXZSARsADx85evSdIDtIaJgSxAX20sJHmJHG3wkBtWQYKZjFhICozRVDKaSkZTyWgqGU0lo6lkNJWMphIiAECAAQCHcyGW+TXwowAAAABJRU5ErkJggg=='
			bgImg.onload = () => {
				loadImg = true
				this.initDraw()
			}
		}
	}

	mounted() {
		// @ts-ignore
		this.canvas = document.getElementById('ruler-v')
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
}

.d-ruler-wrapper-y {
	position: absolute;
	top: 18px;
	left: 0;
	z-index: 9;
	width: 18px;
	height: calc(100% - 18px);
	box-shadow: #111 0 0 1px;
}

.d-ruler-mouse-y {
	top: 0;
	left: 0;
	z-index: 30;
	width: 9999px;
	height: 0;
	pointer-events: none;
	border-top: 1px dashed var(--lineRed);

	.num {
		position: absolute;
		top: -22px;
		left: 0;
		padding: 4px;
		font-size: 12px;
		line-height: 14px;
		color: var(--white);
		background: var(--lineRed);
		transform: rotate(-90deg);
	}
}
</style>
