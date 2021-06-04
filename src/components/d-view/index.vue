<template lang="pug">
#screen.canvas-wrapper(ref="canvas-wrapper", :style="editor.screenStyle")
	template(v-for="item in showWidgets")
		parts(
			:key="item.id",
			:type="item.type",
			:config="item.config",
			:children="item.children",
			:ref="item.id",
			:market="item.market",
			:style="item.config.widget.hide ? 'display: none' : ''",
			readonly)
</template>
<script lang="ts">
import parts from '../d-widget-part/index.vue'
import loadMask from '../load-mask/index.vue'
import instance from '../../store/instance.store'
import { Component, Vue, Provide } from 'vue-property-decorator'
import Editor from '@/core/Editor'

@Component({
	components: {
		parts,
		loadMask,
	},
})
export default class DView extends Vue {
	@Provide('kanboardEditor') kanboardEditor = this
	editor = Editor.Instance()
	
	get showWidgets () {
		if (this.editor.scene.sceneIndex === 0) {
			return this.editor.screen.sceneWidgets[0]
		} else {
			return [
				...(this.editor.screen.sceneWidgets[this.editor.scene.sceneIndex] || []),
				...this.editor.screen.sceneWidgets[0]
			]
		}
	}

	mounted() {
		instance.actions.setInstance('kanboard', this)
		this.editor.updateEditorStatus('inPreview')
	}
}
</script>
<style lang="scss" scoped>
.canvas-wrapper {
	&::before {
		display: flex;
		content: '';
	}
}

::v-deep {
	.load-mask {
		position: fixed !important;
	}
}
</style>
