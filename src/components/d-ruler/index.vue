<template lang="pug">
.d-ruler-wrapper.pos-r
	i-icon.pos-a.d-ruler-guide-visible.pointer.z-index-999.text-center(
		:type="editor.ruler.guideVisible ? 'ios-eye-off-outline' : 'ios-eye-outline'",
		@click="editor.ruler.guideVisible = !editor.ruler.guideVisible")
	x-line
	y-line
	#ruler-content.d-ruler-content(
		@mousedown="rulerContentMouseDown",
		@wheel="editor.wheelRulerContentPosition($event)",
		@mousemove="rulerContentMouseMove",
		:class="{ drag: event.contentMove }")
		.content-body.pos-a(
			:id="editor.ruler.dragId",
			:style="editor.ruler.rulerStyle")
			slot
</template>
<script lang="ts">
import xLine from './xLine.vue'
import yLine from './yLine.vue'
import event from '../../store/event.store'
import { Component, Watch, Vue } from 'vue-property-decorator'
import { Icon } from 'view-design'
import { rulerContentMouseDown, rulerContentMouseMove } from '@/events'
import Editor from '@/core/Editor'
@Component({
	components: {
		xLine,
		yLine,
		'i-icon': Icon,
	},
})
export default class DRuler extends Vue {
	event = event.state
	editor = Editor.Instance()
	rulerContentMouseDown = rulerContentMouseDown
	rulerContentMouseMove = rulerContentMouseMove

	@Watch('editor.ruler.contentScrollLeft')
	contentXChange() {
		this.editor.ruler.contentX += this.editor.ruler.contentScrollLeft
	}

	@Watch('editor.ruler.contentScrollTop')
	contentYChange() {
		this.editor.ruler.contentY += this.editor.ruler.contentScrollTop
	}

	windowResize() {
		const id = this.editor.ruler.dragId
		const dragContent: any = document.getElementById(id).firstChild
		this.editor.ruler.width = dragContent.scrollWidth
		this.editor.ruler.height = dragContent.scrollHeight
		this.editor.resetZoom()
	}

	mounted() {
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
