<template lang="pug">
    .d-ruler-wrapper-y(@mouseenter="showHelp=true" @mouseleave="showHelp=false" @mousedown.stop="mousedownStop" @mouseup.stop="mouseup")
        canvas#ruler-v.pos-a(width="18" height="9999")
        .d-ruler-mouse-y.pos-a(:style="`transform: translateY(${(clientY-platform.ruler.size - platform.ruler.yRoom)}px)`" v-if="showHelp")
            .num {{ site }}
</template>
<script lang="ts">
	import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
	import platform from '../../store/platform.store'

	let i = 0
	let loadImg = false
	const bgImg = new Image()

    @Component
	export default class YLine extends Vue {
        @Prop() clientY
        platform = platform.state
        showHelp: boolean = false
        canvas: HTMLCanvasElement = null
        context = null

        get site () {
            return ~~((this.clientY - this.platform.ruler.size - this.platform.ruler.yRoom - this.platform.ruler.guideStartY) / this.platform.ruler.zoom)
        }

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

        mousedownStop () {
            this.platform.ruler.dragFlag = 'y'
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
                const num = ~~(x / this.platform.ruler.zoom)
                this.context.fillText(num, -num.toString().length * 8, 0)
                x = x + this.platform.ruler.stepLength
                this.context.restore()
            }

            if (t.f > 0) {
                let xe = 0
                while (xe < t.f) {
                    this.context.save()
                    xe = xe + this.platform.ruler.stepLength
                    this.context.drawImage(bgImg, 0, -xe)
                    this.context.translate(10, -xe + 28)
                    this.context.rotate(-Math.PI / 2)
                    this.context.fillText(~~-(xe / this.platform.ruler.zoom), 2, 0)
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
        init () {
            this.context.translate(0, this.platform.panelConfig.size.height * (1 - this.platform.ruler.zoom) / 2 + this.platform.ruler.contentY - this.platform.ruler.guideStartY)
            this.platform.ruler.guideStartY = this.platform.panelConfig.size.height * (1 - this.platform.ruler.zoom) / 2 + this.platform.ruler.contentY
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
	@import "src/scss/conf";

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
		border-top: 1px dashed $themeColor;

		.num {
			position: absolute;
			top: -22px;
			left: 0;
			padding: 4px;
			font-size: 12px;
			line-height: 14px;
			color: #fff;
			background: $themeColor_08;
			transform: rotate(-90deg);
		}
	}

</style>
