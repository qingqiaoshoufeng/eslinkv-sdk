<template lang="pug">
.d-ruler-wrapper.pos-r
	i-icon.pos-a.d-ruler-guide-visible.pointer.z-index-999.text-center(
		:type="ruler.guideVisible ? 'ios-eye-off-outline' : 'ios-eye-outline'",
		@click="ruler.guideVisible = !ruler.guideVisible")
	x-line
	y-line
	#ruler-content.d-ruler-content(
		ref="rulerContent",
		@mousedown="rulerContentMouseDown",
		@wheel="rulerContentWheel",
		@mousemove="rulerContentMouseMove",
		:class="{ drag: event.contentMove }")
		.content-body.pos-a(:id="ruler.dragId", :style="ruler.rulerStyle")
			slot
</template>
<script lang="ts">
import xLine from './xLine.vue'
import yLine from './yLine.vue'
import event from '../../store/event.store'
import { Component, Watch, Vue } from 'vue-property-decorator'
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
	event = event.state
	ruler: RulerV = {}
	rulerContentMouseDown = rulerContentMouseDown
	rulerContentMouseMove = rulerContentMouseMove
	rulerContentWheel = rulerContentWheel

	@Watch('ruler.contentScrollLeft')
	contentXChange() {
		this.ruler.contentX += this.ruler.contentScrollLeft
	}

	@Watch('ruler.contentScrollTop')
	contentYChange() {
		this.ruler.contentY += this.ruler.contentScrollTop
	}

	windowResize() {
		const id = this.ruler.dragId
		const dragContent: any = document.getElementById(id).firstChild
		this.ruler.width = dragContent.scrollWidth
		this.ruler.height = dragContent.scrollHeight
		this.ruler.resetZoom()
	}

	mounted() {
		this.ruler = this.$ruler
		window.addEventListener('resize', this.windowResize)
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
