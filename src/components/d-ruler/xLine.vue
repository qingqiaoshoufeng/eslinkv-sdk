<template lang="pug">
  .d-ruler-wrapper-x(@mouseenter="showHelp=true" @mouseleave="showHelp=false" @mousedown.stop="mousedownStop" @mouseup.stop="mouseup")
    canvas#ruler-x.pos-a(width="9999" height="18")
    .d-ruler-mouse-x.pos-a(:style="`transform: translateX(${(clientX-platform.ruler.size - platform.ruler.xRoom)}px)`" v-if="showHelp")
      .num {{ site }}
</template>
<script lang="ts">
	import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
	import platform from '../../store/platform.store'

	let i = 0
	let loadImg = false
	const bgImg = new Image()

	@Component
	export default class XLine extends Vue {
        @Prop() clientX
        platform = platform.state
        showHelp:boolean=false
        canvas:HTMLCanvasElement = null
        context = null
    
        get site () {
          return ~~((this.clientX - this.platform.ruler.size - this.platform.ruler.xRoom - this.platform.ruler.guideStartX) / this.platform.ruler.zoom)
        }
    
        @Watch('platform.ruler.zoom')
        zoomChange () {
            this.init()
        }
    
        @Watch('platform.ruler.contentX')
        contentXChange () {
            this.init()
        }
    
        @Watch('platform.panelConfig.size.width')
        widthChange () {
            this.init()
        }
    
        mousedownStop () {
          this.platform.ruler.dragFlag = 'x'
          if (this.platform.ruler.dragGuideId) {
            platform.actions.changeGuideLine(this.site)
          } else {
            platform.actions.guideAdd(this.site)
          }
          this.platform.ruler.guideDrag = false
          this.platform.ruler.dragGuideId = ''
        }

        mouseup () {
          if (this.platform.ruler.guideDrag) {
            platform.actions.changeGuideLine(this.site)
            this.platform.ruler.guideDrag = false
            this.platform.ruler.dragGuideId = ''
          }
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
            this.context.translate(num, 0)
            this.init()
        }

        clearRulerCanvas () {
            const t = this.context.getTransform()
            this.context.clearRect(-t.e, 0, this.canvas.width - t.e, this.canvas.height)
        }

        initDraw () {
            this.clearRulerCanvas()
            const t = this.context.getTransform()
            let x = 0
            while (x < this.canvas.width - t.e) {
                this.context.drawImage(bgImg, x, 0)
                this.context.fillText(~~(x / this.platform.ruler.zoom), x + 4, 10)
                x = x + this.platform.ruler.stepLength
            }

            if (t.e > 0) {
                let xe = 0
                while (xe < t.e) {
                    xe = xe + this.platform.ruler.stepLength
                    this.context.drawImage(bgImg, -xe, 0)
                    this.context.fillText(xe === 0 ? '0' : -~~(xe / this.platform.ruler.zoom), -xe + 2, 10)
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
		init () {
			this.context.translate(this.platform.panelConfig.size.width * (1 - this.platform.ruler.zoom) / 2 + this.platform.ruler.contentX - this.platform.ruler.guideStartX, 0)
			this.platform.ruler.guideStartX = this.platform.panelConfig.size.width * (1 - this.platform.ruler.zoom) / 2 + this.platform.ruler.contentX
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

		mounted () {
			this.canvas = document.getElementById('ruler-x')
			this.context = this.canvas.getContext('2d')
			this.context.font = '10px sans-serif'
			this.init()
		}
	}
</script>
<style lang="scss" scoped>
@import "src/scss/conf";

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
	border-left: 1px dashed $themeColor_08;

	.num {
		position: absolute;
		top: 2px;
		left: 3px;
		padding: 4px;
		font-size: 12px;
		line-height: 12px;
		color: #fff;
		background: $themeColor_08;
	}
}
</style>
