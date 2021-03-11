<template lang="pug">
	canvas#ruler-v.pos-a(width="18" height="9999")
</template>
<script lang="ts">
import {Component, Vue, Watch, Prop} from 'vue-property-decorator'
import platform from '../../store/platform.store'

let loadImg = false
const bgImg = new Image()
bgImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAyCAMAAABmvHtTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRFMzMzAAAA////BqjYlAAAACBJREFUeNpiYGBEBwwMTGiAakI0NX7U9aOuHyGuBwgwAH6bBkAR6jkzAAAAAElFTkSuQmCC'

@Component
export default class YLine extends Vue {
	platform = platform.state

	@Watch('platform.ruler.zoom')
	zoomChange (val) {
		this.init()
	}

	@Watch('platform.ruler.contentScrollTop')
	scrollLeftChange (val) {
		this.handleTranslateH(val)
	}

	handleTranslateH(num) {
		const rulerH = document.getElementById('ruler-v')
		const context = rulerH.getContext('2d')
		this.clearCanvasH()
		context.translate(0, this.pos + num)
		this.init()
	}

	clearCanvasH() {
		const rulerH = document.getElementById('ruler-v')
		const context = rulerH.getContext('2d')
		const t = context.getTransform()
		context.clearRect(-t.e, 0, rulerH.width, rulerH.height - t.e)
	}

	initDraw() {
		this.clearCanvasH()
		const rulerH = document.getElementById('ruler-v')
		const context = rulerH.getContext('2d')
		const t = context.getTransform()
		context.font = '10px sans-serif'
		let x = 0
		while (x < rulerH.height - t.f) {
			context.save()
			context.drawImage(bgImg, 0, x)
			context.translate(10, x)
			context.rotate(-Math.PI / 2)
			context.fillText(~~(x / this.platform.ruler.zoom), 0, 0)
			x = x + bgImg.height
			context.restore()
		}

		if (t.f > 0) {
			let xe = 0
			while (xe < t.f) {
				context.save()
				xe = xe + bgImg.height
				context.drawImage(bgImg, 0, -xe)
				context.translate(10, -xe + 28)
				context.rotate(-Math.PI / 2)
				context.fillText(~~-(xe / this.platform.ruler.zoom), 0, 0)
				context.restore()
			}
		}
	}

	init() {
		if (loadImg) {
			this.initDraw()
		} else {
			bgImg.onload = () => {
				loadImg = true
				this.initDraw()
			}
		}
	}

	mounted() {
		this.init()
	}
}
</script>
<style lang="scss" scoped>
canvas {
	left: 0;
}
</style>
