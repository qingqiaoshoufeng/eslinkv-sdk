<template lang="pug">
.d-ruler-wrapper-x(
	@mouseenter="showHelp = true",
	@mouseleave="showHelp = false",
	@mousedown.stop="editor.createGuideLine('v', $route.params.id)",
	@mouseup.stop="editor.createGuideLine('v', $route.params.id)")
	.pos-a
		canvas#ruler-x(width="9999", height="18")
	.d-ruler-mouse-x.pos-a(
		:style="`transform: translateX(${event.clientX - editor.rulerSize - editor.xRoomL1 - editor.xRoomL2}px)`",
		v-if="showHelp")
		.num {{ site }}
</template>
<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import event from '../../store/event.store'
import Editor from '@/core/Editor'

@Component
export default class XLine extends Vue {
	event = event.state
	editor = Editor.Instance()
	showHelp = false
	context = null

	get site() {
		return this.editor.ruler.guideSite('v')
	}

	mounted() {
		this.editor.initX('ruler-x')
	}
}
</script>
<style lang="scss" scoped>
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
	border-left: 1px dashed var(--lineRed);

	.num {
		position: absolute;
		top: 2px;
		left: 3px;
		padding: 4px;
		font-size: 12px;
		line-height: 12px;
		color: var(--white);
		background: var(--lineRed);
	}
}
</style>
