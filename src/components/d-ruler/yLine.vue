<template lang="pug">
	canvas#ruler-v.pos-a(width="18" height="9999")
</template>
<script lang="ts">
	import { Component, Vue, Watch } from 'vue-property-decorator'
	import platform from '../../store/platform.store'

	let i = 0
	let loadImg = false
	const bgImg = new Image()

	@Component
	export default class YLine extends Vue {
		platform = platform.state
		y = 0
		canvas:HTMLCanvasElement = null
		context = null

		@Watch('platform.ruler.zoom')
		zoomChange () {
			this.init()
		}

		@Watch('platform.ruler.contentY')
		contentXChange () {
			this.init()
		}

		@Watch('platform.panelConfig.size.height')
		heightChange () {
			this.init()
		}

		translateAnimation (num) {
			const animation = requestAnimationFrame(() => this.translateAnimation(num))
			if (i === num) {
				cancelAnimationFrame(animation)
				i = 0
			}
			this.handleTranslate(1)
			if (num > 0) i++
			if (num < 0) i--
		}

		handleTranslate (num) {
			this.clearRulerCanvas()
			this.context.translate(0, num)
			this.init()
		}

		clearRulerCanvas () {
			const t = this.context.getTransform()
			this.context.clearRect(-t.e, 0, this.canvas.width, this.canvas.height - t.e)
		}

		initDraw () {
			this.clearRulerCanvas()
			const t = this.context.getTransform()
			let x = 0
			while (x < this.canvas.height - t.f) {
				this.context.save()
				this.context.drawImage(bgImg, 0, x)
				this.context.translate(10, x)
				this.context.rotate(-Math.PI / 2)
				this.context.fillText(~~(x / this.platform.ruler.zoom), 2, 0)
				x = x + bgImg.height
				this.context.restore()
			}

			if (t.f > 0) {
				let xe = 0
				while (xe < t.f) {
					this.context.save()
					xe = xe + bgImg.height
					this.context.drawImage(bgImg, 0, -xe)
					this.context.translate(10, -xe + 28)
					this.context.rotate(-Math.PI / 2)
					this.context.fillText(~~-(xe / this.platform.ruler.zoom), 2, 0)
					this.context.restore()
				}
			}
		}

		init () {
			this.context.translate(0, this.platform.panelConfig.size.height * (1 - this.platform.ruler.zoom) / 2 + this.platform.ruler.contentY - this.y)
			this.y = this.platform.panelConfig.size.height * (1 - this.platform.ruler.zoom) / 2 + this.platform.ruler.contentY
			if (loadImg) {
				this.initDraw()
			} else {
        bgImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAyCAMAAABmvHtTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRFMzMzAAAA////BqjYlAAAACBJREFUeNpiYGBEBwwMTGiAakI0NX7U9aOuHyGuBwgwAH6bBkAR6jkzAAAAAElFTkSuQmCC'
				bgImg.onload = () => {
					loadImg = true
					this.initDraw()
				}
			}
		}

		mounted () {
			this.canvas = document.getElementById('ruler-v')
			this.context = this.canvas.getContext('2d')
			this.context.font = '10px sans-serif'
			this.init()
		}
	}
</script>
<style lang="scss" scoped>
	canvas {
		left: 0;
	}
</style>
