<template lang="pug">
	canvas#ruler-h.pos-a(width="9999" height="18")
</template>
<script lang="ts">
import {Component, Vue, Watch, Prop} from 'vue-property-decorator'
import platform from '../../store/platform.store'

let i = 0
let loadImg = false
const bgImg = new Image()
bgImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAASCAMAAAAuTX21AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRFMzMzAAAA////BqjYlAAAACNJREFUeNpiYCAdMDKRCka1jGoBA2JZZGshiaCXFpIBQIABAAplBkCmQpujAAAAAElFTkSuQmCC'

@Component
export default class XLine extends Vue {
	platform = platform.state
	
	@Watch('platform.ruler.zoom')
	zoomChange (val, oldVal) {
		this.init()
	}
	
	@Watch('platform.ruler.contentScrollLeft')
	contentPositionChange (val) {
		this.handleTranslate(val)
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
		const rulerH = document.getElementById('ruler-h')
		const context = rulerH.getContext('2d')
		this.clearRulerCanvas()
		context.translate(num, 0)
		this.init()
	}

	clearRulerCanvas() {
		const rulerH = document.getElementById('ruler-h')
		const context = rulerH.getContext('2d')
		const t = context.getTransform()
		context.clearRect(-t.e, 0, rulerH.width - t.e, rulerH.height)
	}

	initDraw() {
		this.clearRulerCanvas()
		const rulerH = document.getElementById('ruler-h')
		const context = rulerH.getContext('2d')
		const t = context.getTransform()
		context.font = '10px sans-serif'
		let x = 0
		while (x < rulerH.width - t.e) {
			context.drawImage(bgImg, x, 0)
			context.fillText(~~(x / this.platform.ruler.zoom), x + 2, 10)
			x = x + bgImg.width
		}

		if (t.e > 0) {
			let xe = 0
			while (xe < t.e) {
				xe = xe + bgImg.width
				context.drawImage(bgImg, -xe, 0)
				context.fillText(-~~(xe / this.platform.ruler.zoom), -xe + 2, 10)
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
	//width: 100%;
	height: 100%;
	left: 0;
}
</style>
