<template lang="pug">
.d-ruler-wrapper-x(
	@mouseenter="showHelp = true",
	@mouseleave="showHelp = false",
	@mousedown.stop="editor.createGuideLine('v')",
	@mouseup.stop="editor.createGuideLine('v')")
	.d-ruler-mouse-x.pos-a(
		:style="`transform: translateX(${editor.eve.clientX - editor.rulerSize - editor.xRoomL1 - editor.xRoomL2}px)`",
		v-if="showHelp")
		.num {{ site }}
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Editor from '@/core/Editor'

@Component
export default class XLine extends Vue {
	editor = Editor.Instance()
	showHelp = false

	get site(): number {
		return this.editor.eve.guideSite('v')
	}
}
</script>
