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
		box-shadow: #111 0 0 1px;
		z-index: 9;

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
		top: 0;
		left: 0;
		z-index: 30;
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
				margin-top: 1px;
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
