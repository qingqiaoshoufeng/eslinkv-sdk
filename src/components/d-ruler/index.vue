<template lang="pug">
	.vue-ruler-wrapper.pos-r
		section(v-show="platform.ruler.rulerVisible"
			:style="(contentMove || platform.ruler.zoom !== 1 || platform.ruler.lockGuides) && 'pointer-events: none'")
			.ruler-wrapper.h
				.vue-ruler-h(
					ref="horizontalRuler"
					:style="hRulerStyle" @mousedown.stop="horizontalDragRuler")
					span.n(v-for="(item, index) in xScale" :key="index" :style="{ left: index * 50 + 2 + 'px' }"
						:class="{ zeroScale: item.id === 0 }") {{ item.id }}
			.ruler-wrapper.v
				.vue-ruler-v(
					ref="verticalRuler"
					:style="vRulerStyle" @mousedown.stop="verticalDragRuler")
					span.n(v-for="(item, index) in yScale"
						:key="index"
						:style="{ top: index * 50 + 2 + 'px' }") {{ item.id }}
			.mouse-position.x(:style="`transform: translateX(${clientX- leftSpacing}px)`")
			.mouse-position.y(:style="`transform: translateY(${clientY - topSpacing}px)`")
		guides(
			:vGuideTop="verticalDottedTop"
			:hGuideLeft="horizontalDottedLeft"
			:contentMove="contentMove"
			:contentWidth="contentWidth"
			:contentHeight="contentHeight")
		.vue-ruler-content(:class="{ drag: contentMove }" @mousedown="handleContentMoveStart" @mousemove.prevent)
			.content-body(:id="platform.ruler.dragId" :style="contentStyle")
				slot
</template>
<script lang="ts">
	import guides from './guides.vue'
	import eventHandlers from './event'
	import guideDrag from './guide-drag'
	import platform from '../../store/platform.store'
	import {mixins} from 'vue-class-component'
	import {Component, Prop} from 'vue-property-decorator'

	@Component({
		components: {
			guides
		},
	})
	export default class DRuler extends mixins(eventHandlers, guideDrag) {
		@Prop({default: false}) isScaleRevise
		@Prop({default: false}) parent

		platform = platform.state
		size = 18
		xScale = [] // 水平刻度
		yScale = [] // 垂直刻度
		topSpacing = 0 // 标尺与窗口上间距
		leftSpacing = 0 //  标尺与窗口左间距

		get contentStyle() {
			return `transform:translate3d(${this.platform.ruler.contentScrollLeft}px, ${this.platform.ruler.contentScrollTop}px, 0) scale(${this.platform.ruler.zoom});width:${this.contentWidth + 18 * 2} px;height:${this.contentHeight + 18 * 2} px;`
		}

		/**
		 * @description
		 *
		 * 距离左侧的刻度
		 * 移动面板的宽度 缩放后的像素差
		 * 去控制刻度显示和位移（有正负）
		 */
		get hRulerStyle() {
			const fixedWidth = this.contentWidth * (this.platform.ruler.zoom - 1) / 2
			const translateX = Math.ceil(this.platform.ruler.contentScrollLeft - fixedWidth - this.platform.ruler.rulerRange / 2)
			return `width: ${this.platform.ruler.rulerRange * 1.5}px; transform: translateX(${translateX}px);`
		}

		/**
		 * @description
		 *
		 * 距离顶侧的刻度
		 * 移动面板的高度 缩放后的像素差
		 * 去控制刻度显示和位移（有正负）
		 */
		get vRulerStyle() {
			const fixedHeight = this.contentHeight * (this.platform.ruler.zoom - 1) / 2
			const translateY = Math.ceil(this.platform.ruler.contentScrollTop - fixedHeight - this.platform.ruler.rulerRange / 2)
			return `height: ${this.platform.ruler.rulerRange * 1.5}px; transform: translateY(${translateY}px);`
		}

		setSpacing() {
			this.topSpacing = Math.ceil(this.$refs.horizontalRuler.getBoundingClientRect().y)
			this.leftSpacing = Math.ceil(this.$refs.verticalRuler.getBoundingClientRect().x)
		}
	}
</script>

<style lang="scss">
	.ruler-wrapper {
		position: absolute;
		box-shadow: #111 0 0 1px;

		&.h {
			width: calc(100% - 18px);
			height: 18px;
			top: 0;
			left: 18px;

			&:before {
				content: 'D';
				position: absolute;
				left: -18px;
				width: 18px;
				height: 18px;
				z-index: 1000;
				color: #77ecff;
				font-weight: 900;
				text-align: center;
				background-color: #111;
				line-height: 18px;
			}
		}

		&.v {
			width: 18px;
			height: calc(100% - 18px);
			left: 0;
			top: 18px;
		}

		.vue-ruler-h,
		.vue-ruler-v {
			position: absolute;
			left: 0;
			top: 0;
			overflow: hidden;
			z-index: 3;
			transition: transform 0.4s;
		}

		.vue-ruler-h {
			height: 18px;
			left: 0;
			opacity: 0.6;
			background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAASCAMAAAAuTX21AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRFMzMzAAAA////BqjYlAAAACNJREFUeNpiYCAdMDKRCka1jGoBA2JZZGshiaCXFpIBQIABAAplBkCmQpujAAAAAElFTkSuQmCC) repeat-x;
			cursor: n-resize;
		}

		.vue-ruler-v {
			width: 18px;
			top: 0;
			opacity: 0.6;
			background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAyCAMAAABmvHtTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRFMzMzAAAA////BqjYlAAAACBJREFUeNpiYGBEBwwMTGiAakI0NX7U9aOuHyGuBwgwAH6bBkAR6jkzAAAAAElFTkSuQmCC) repeat-y;
			cursor: w-resize;
		}

		.vue-ruler-v .n,
		.vue-ruler-h .n {
			position: absolute;
			font: 10px/1 serif;
			color: #333;
			cursor: default;
			pointer-events: none;
		}

		.vue-ruler-v .n {
			width: 50px;
			left: -18px;
			margin-top: 17px;
			word-wrap: normal;
			text-align: right;
			transform: rotate(-90deg);
		}

		.vue-ruler-h .n {
			top: 1px;
			pointer-events: none;
		}
	}

	.mouse-position {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 3;
		pointer-events: none;

		&.x {
			height: 18px;
			width: 1px;
			background-color: red;
		}

		&.y {
			height: 1px;
			width: 18px;
			background-color: red;
		}
	}

	.vue-ruler {
		&-wrapper {
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			z-index: 1;
			overflow: hidden;
			user-select: none;
			background-color: rgba(0, 0, 0, 0.1);
		}

		&-content {
			position: absolute;
			left: 0;
			top: 0;
			z-index: 1;
			width: 100%;
			height: 100%;
			overflow: hidden;

			&.drag {
				cursor: move;
			}

			.content-body {
				position: absolute;
				left: 0;
				top: 0;
				border: 18px transparent solid;
				transition: all .3s;
				overflow: visible;
				background-image: url(../../../src/assets/editor/transparent-bg.png);
				background-clip: content-box;
				background-size: 32px;
			}
		}

		&-content-mask {
			position: absolute;
			width: 100%;
			height: 100%;
			background: transparent;
			z-index: 4;
		}
	}
</style>
