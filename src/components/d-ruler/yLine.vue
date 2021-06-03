<template lang="pug">
.d-ruler-wrapper-y(
	@mouseenter="showHelp = true",
	@mouseleave="showHelp = false",
	@mousedown.stop="editor.createGuideLine('h')",
	@mouseup.stop="editor.createGuideLine('h')")
	canvas#ruler-v.pos-a(width="18", height="9999")
	.d-ruler-mouse-y.pos-a(
		:style="`transform: translateY(${editor.eve.clientY - editor.rulerSize - editor.yRoom}px)`",
		v-if="showHelp")
		.num {{ site }}
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Editor from '@/core/Editor'

@Component
export default class YLine extends Vue {
	editor = Editor.Instance()
	showHelp = false

	get site(): number {
		return this.editor.eve.guideSite('h')
	}
}
</script>
<style lang="scss" scoped></style>
