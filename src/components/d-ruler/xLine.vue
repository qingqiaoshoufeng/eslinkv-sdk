<template lang="pug">
	canvas#ruler-h.pos-a(width="9999" height="18")
</template>
<script lang="ts">
	import {Component, Vue, Watch} from 'vue-property-decorator'
	import platform from '../../store/platform.store'

	let i = 0
	let loadImg = false
	const bgImg = new Image()

	@Component
	export default class XLine extends Vue {
		platform = platform.state
		x = 0
		canvas = null
		context = null

		@Watch('platform.ruler.zoom')
		zoomChange() {
			this.init()
		}

		@Watch('platform.ruler.contentX')
		contentXChange() {
			this.init()
		}

		@Watch('platform.panelConfig.size.width')
		widthChange() {
			this.init()
		}

		translateAnimation(num) {
			const animation = requestAnimationFrame(() => this.translateAnimation(num))
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
			this.context.clearRect(-t.e, 0, this.canvas.width - t.e, this.canvas.height)
		}

		initDraw() {
			this.clearRulerCanvas()
			const t = this.context.getTransform()
			let x = 0
			while (x < this.canvas.width - t.e) {
				this.context.drawImage(bgImg, x, 0)
				this.context.fillText(~~(x / this.platform.ruler.zoom), x + 2, 10)
				x = x + bgImg.width
			}

			if (t.e > 0) {
				let xe = 0
				while (xe < t.e) {
					xe = xe + bgImg.width
					this.context.drawImage(bgImg, -xe, 0)
					this.context.fillText(-~~(xe / this.platform.ruler.zoom), -xe + 2, 10)
				}
			}
		}

		init() {
			this.context.translate(this.platform.panelConfig.size.width * (1 - this.platform.ruler.zoom) / 2 + this.platform.ruler.contentX - this.x, 0)
			this.x = this.platform.panelConfig.size.width * (1 - this.platform.ruler.zoom) / 2 + this.platform.ruler.contentX
			if (loadImg) {
				this.initDraw()
			} else {
        bgImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAASCAMAAAAuTX21AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRFMzMzAAAA////BqjYlAAAACNJREFUeNpiYCAdMDKRCka1jGoBA2JZZGshiaCXFpIBQIABAAplBkCmQpujAAAAAElFTkSuQmCC'
				bgImg.onload = () => {
					loadImg = true
					this.initDraw()
				}
			}
		}

		mounted() {
			this.canvas = <HTMLCanvasElement>document.getElementById('ruler-h')
			this.context = this.canvas.getContext('2d')
			this.context.font = '10px sans-serif'
			this.init()
		}
	}
</script>
<style lang="scss" scoped>
	canvas {
		left: 0;
		height: 100%;
	}
</style>
