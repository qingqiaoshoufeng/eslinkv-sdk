<template lang="pug">
	.vue-ruler-wrapper.pos-r
		section(v-show="platform.ruler.rulerVisible"
			:style="(contentMove || platform.ruler.zoom !== 1 || platform.ruler.lockGuides) && 'pointer-events: none'")
			.ruler-wrapper.h(ref="horizontalRuler" @mousedown.stop="horizontalDragRuler")
				x-line
			.ruler-wrapper.v(ref="verticalRuler" @mousedown.stop="verticalDragRuler")
				y-line
			.mouse-position.x.pos-a(:style="`transform: translateX(${clientX}px)`")
			.mouse-position.y.pos-a(:style="`transform: translateY(${clientY}px)`")
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
	import xLine from './xLine.vue'
	import yLine from './yLine.vue'
	import eventHandlers from './event'
	import guideDrag from './guide-drag'
	import platform from '../../store/platform.store'
	import { mixins } from 'vue-class-component'
	import { Component, Prop, Watch } from 'vue-property-decorator'

	@Component({
		components: {
			guides, xLine, yLine
		}
	})
	export default class DRuler extends mixins(eventHandlers, guideDrag) {
		@Prop({ default: false }) isScaleRevise
		@Prop({ default: false }) parent

		platform = platform.state
		size = 18

		@Watch('platform.ruler.contentScrollLeft')
		contentXChange () {
			this.platform.ruler.contentX += this.platform.ruler.contentScrollLeft
		}

		@Watch('platform.ruler.contentScrollTop')
		contentYChange () {
			this.platform.ruler.contentY += this.platform.ruler.contentScrollTop
		}

		get contentStyle () {
			return `transform:translate3d(${this.platform.ruler.contentX}px, ${this.platform.ruler.contentY}px, 0) scale(${this.platform.ruler.zoom});width:${this.contentWidth + 18 * 2} px;height:${this.contentHeight + 18 * 2} px;`
		}
	}
</script>

<style lang="scss">
	.ruler-wrapper {
		position: absolute;
		z-index: 9;
		box-shadow: #111 0 0 1px;

		&.h {
			top: 0;
			left: 18px;
			width: calc(100% - 18px);
			height: 18px;

			&::before {
				position: absolute;
				left: -18px;
				z-index: 1000;
				width: 18px;
				height: 18px;
				font-weight: 900;
				line-height: 18px;
				color: #77ecff;
				text-align: center;
				content: 'D';
				background-color: #111;
			}
		}

		&.v {
			top: 18px;
			left: 0;
			width: 18px;
			height: calc(100% - 18px);
		}

		.vue-ruler-h,
		.vue-ruler-v {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 3;
			overflow: hidden;
			transition: transform 0.4s;
		}

		.vue-ruler-h {
			left: 0;
			height: 18px;
			cursor: n-resize;
			background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAASCAMAAAAuTX21AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRFMzMzAAAA////BqjYlAAAACNJREFUeNpiYCAdMDKRCka1jGoBA2JZZGshiaCXFpIBQIABAAplBkCmQpujAAAAAElFTkSuQmCC) repeat-x;
			opacity: 0.6;
		}

		.vue-ruler-v {
			top: 0;
			width: 18px;
			cursor: w-resize;
			background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAyCAMAAABmvHtTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRFMzMzAAAA////BqjYlAAAACBJREFUeNpiYGBEBwwMTGiAakI0NX7U9aOuHyGuBwgwAH6bBkAR6jkzAAAAAElFTkSuQmCC) repeat-y;
			opacity: 0.6;
		}

		.vue-ruler-v .n,
		.vue-ruler-h .n {
			position: absolute;
			font: 10px/1 serif;
			color: #333;
			pointer-events: none;
			cursor: default;
		}

		.vue-ruler-v .n {
			left: -18px;
			width: 50px;
			margin-top: 17px;
			text-align: right;
			word-wrap: normal;
			transform: rotate(-90deg);
		}

		.vue-ruler-h .n {
			top: 1px;
			pointer-events: none;
		}
	}

	.mouse-position {
		top: 0;
		left: 0;
		z-index: 30;
		pointer-events: none;

		&.x {
			width: 1px;
			height: 18px;
			background-color: red;
		}

		&.y {
			width: 18px;
			height: 1px;
			background-color: red;
		}
	}

	.vue-ruler {
		&-wrapper {
			top: 0;
			left: 0;
			z-index: 1;
			width: 100%;
			height: 100%;
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
				position: absolute;
				top: 0;
				left: 0;
				margin-top: 1px;
				overflow: visible;
				background-image: url(../../../src/assets/editor/transparent-bg.png);
				background-clip: content-box;
				background-size: 32px;
				border: 18px transparent solid;
				transition: all 0.3s;
			}
		}

		&-content-mask {
			position: absolute;
			z-index: 4;
			width: 100%;
			height: 100%;
			background: transparent;
		}
	}
</style>
