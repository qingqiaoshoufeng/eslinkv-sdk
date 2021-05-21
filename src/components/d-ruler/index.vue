<template lang="pug">
.d-ruler-wrapper.pos-r
	i-icon.pos-a.d-ruler-guide-visible.pointer.z-index-999.text-center(
		:type="ruler.guideVisible ? 'ios-eye-off-outline' : 'ios-eye-outline'",
		@click="ruler.guideVisible = !ruler.guideVisible")
	x-line(ref="xline")
	y-line(ref="yline")
	#ruler-content.d-ruler-content(
		ref="rulerContent",
		@mousedown="rulerContentMouseDown",
		@wheel="rulerContentWheel",
		@mousemove="rulerContentMouseMove",
		:class="{ drag: event.contentMove }")
		.content-body.pos-a(:id="ruler.dragId", :style="contentStyle")
			slot
</template>
<script lang="ts">
import xLine from './xLine.vue'
import yLine from './yLine.vue'
import platform from '../../store/platform.store'
import event from '../../store/event.store'
import ruler from '../../store/ruler.store'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { Icon } from 'view-design'
import {
	rulerContentMouseDown,
	rulerContentMouseMove,
	rulerContentWheel,
} from '@/events'
@Component({
	components: {
		xLine,
		yLine,
		'i-icon': Icon,
	},
})
export default class DRuler extends Vue {
	@Prop({ default: false }) isScaleRevise
	@Prop({ default: false }) parent

	platform = platform.state
	event = event.state
	ruler = ruler.state
	contentWidth = 0
	contentHeight = 0
	rulerContentMouseDown = rulerContentMouseDown
	rulerContentMouseMove = rulerContentMouseMove
	rulerContentWheel = rulerContentWheel

	@Watch('ruler.contentScrollLeft')
	contentXChange() {
		this.ruler.contentX += this.ruler.contentScrollLeft
	}

	@Watch('platform.height', { deep: true })
	heightChange() {
		ruler.actions.resetZoom()
	}

	@Watch('platform.width', { deep: true })
	widthChange() {
		ruler.actions.resetZoom()
	}

	@Watch('ruler.contentScrollTop')
	contentYChange() {
		this.ruler.contentY += this.ruler.contentScrollTop
	}

	get contentStyle() {
		return `transform:translate3d(${this.ruler.contentX}px, ${
			this.ruler.contentY
		}px, 0) scale(${this.ruler.zoom});width:${
			(this as any).contentWidth + 18 * 2
		} px;height:${(this as any).contentHeight + 18 * 2} px;`
	}

	windowResize() {
		const id = this.ruler.dragId
		const dragContent = document.getElementById(id)
		// @ts-ignore
		this.contentWidth = dragContent.firstChild.scrollWidth
		// @ts-ignore
		this.contentHeight = dragContent.firstChild.scrollHeight
	}

	mounted() {
		window.addEventListener('resize', this.windowResize)
		setTimeout(() => {
			ruler.actions.resetZoom()
		})
	}
}
</script>

<style lang="scss">
.d-ruler-guide-visible {
	position: absolute;
	left: 0;
	width: 18px;
	height: 18px;
	line-height: 18px;
	color: var(--white);
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
