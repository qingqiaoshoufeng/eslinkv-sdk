<template lang="pug">
div(:style="{ zIndex }", :class="currentAnimate", @animationend.self="animationend")
	slot
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Editor from '@/core/Editor'

@Component
export default class DScene extends Vue {
	@Prop() zIndex
	@Prop() sceneId

	editor: Editor = Editor.Instance()

	get currentAnimate(): string {
		if (this.editor.current.currentCreateSceneList.includes(this.sceneId)) {
			return `scene-container animated ${this.editor.current.sceneAnimationMap[this.sceneId].value}`
		}
		return 'scene-container'
	}

	animationend(): void {
		if (this.editor.current.sceneAnimationMap[this.sceneId].type === 'open') {
			// 打开场景
			this.$emit('sceneLoaded')
		} else {
			// 关闭场景
			this.$emit('beforeSceneDestroy')
			const index = this.editor.current.currentCreateSceneList.findIndex(v => v === this.sceneId)
			this.editor.current.currentCreateSceneList.splice(index, 1)
			let event = new CustomEvent('DestroyScene', { detail: { index: this.sceneId } })
			document.dispatchEvent(event)
			event = null
		}
	}
}
</script>
<style lang="scss" scoped>
.scene-container {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	pointer-events: none;
}
</style>
