<template lang="pug">
.d-ruler-wrapper.pos-r
	i-icon.pos-a.d-ruler-guide-visible.pointer.z-index-999.text-center(
		:type="platform.ruler.guideVisible ? 'ios-eye-off-outline' : 'ios-eye-outline'",
		@click="platform.ruler.guideVisible = !platform.ruler.guideVisible")
	x-line(:clientX="clientX", ref="xline")
	y-line(:clientY="clientY", ref="yline")
	.d-ruler-content#ruler-content(
		ref="rulerContent",
		:class="{ drag: platform.ruler.contentMove }",
		@click="deactivateWidget",
		@mousedown="handleContentMoveStart",
		@mousemove.prevent)
		.content-body.pos-a(:id="platform.ruler.dragId", :style="contentStyle")
			slot
</template>
<script lang="ts">
import xLine from './xLine.vue'
import yLine from './yLine.vue'
import eventHandlers from './event'
import platform from '../../store/platform.store'
import { mixins } from 'vue-class-component'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Icon } from 'view-design'

@Component({
	components: {
		xLine,
		yLine,
		'i-icon': Icon,
	},
})
export default class DRuler extends mixins(eventHandlers) {
	@Prop({ default: false }) isScaleRevise
	@Prop({ default: false }) parent

	platform = platform.state

	@Watch('platform.ruler.contentScrollLeft')
	contentXChange() {
		this.platform.ruler.contentX += this.platform.ruler.contentScrollLeft
	}

	@Watch('platform.ruler.contentScrollTop')
	contentYChange() {
		this.platform.ruler.contentY += this.platform.ruler.contentScrollTop
	}

	get contentStyle() {
		return `transform:translate3d(${this.platform.ruler.contentX}px, ${
			this.platform.ruler.contentY
		}px, 0) scale(${this.platform.ruler.zoom});width:${
			(this as any).contentWidth + 18 * 2
		} px;height:${(this as any).contentHeight + 18 * 2} px;`
	}

	deactivateWidget() {
		platform.actions.unChooseWidget()
	}
}
</script>

<style lang="scss">
@import 'src/scss/conf';

.d-ruler-guide-visible {
	position: absolute;
	left: 0;
	width: 18px;
	height: 18px;
	line-height: 18px;
	color: #fff;
	background-color: #111;
}

.d-ruler {
	&-wrapper {
		top: 0;
		left: 0;
		z-index: 1;
		width: 100%;
		height: calc(100% - 32px);
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
			top: 0;
			left: 0;
			margin-top: 1px;
			overflow: visible;
			border: 18px transparent solid;
			transition: all 0.3s;
		}
	}
}
</style>
