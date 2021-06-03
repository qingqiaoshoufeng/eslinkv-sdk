<template lang="pug">
.d-ruler-wrapper-y(
	@mouseenter="showHelp = true",
	@mouseleave="showHelp = false",
	@mousedown.stop="editor.createGuideLine('h', $route.params.id)",
	@mouseup.stop="editor.createGuideLine('h', $route.params.id)")
	canvas#ruler-v.pos-a(width="18", height="9999")
	.d-ruler-mouse-y.pos-a(
		:style="`transform: translateY(${event.clientY - editor.rulerSize - editor.yRoom}px)`",
		v-if="showHelp")
		.num {{ site }}
</template>
<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import event from '../../store/event.store'
import Editor from '@/core/Editor'

let i = 0
let loadImg = false
const bgImg = new Image()

@Component
export default class YLine extends Vue {
	event = event.state
	editor = Editor.Instance()
	showHelp = false
	canvas: HTMLCanvasElement
	context = null
	screen = this.$screen

	get site() {
		return this.editor.ruler.guideSite('h')
	}

	@Watch('screen.height')
	heightChange() {
		this.editor.initY()
	}

	mounted() {
		this.editor.initY('ruler-v')
	}
}
</script>
<style lang="scss" scoped>
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
	border-top: 1px dashed var(--lineRed);

	.num {
		position: absolute;
		top: -22px;
		left: 0;
		padding: 4px;
		font-size: 12px;
		line-height: 14px;
		color: var(--white);
		background: var(--lineRed);
		transform: rotate(-90deg);
	}
}
</style>
