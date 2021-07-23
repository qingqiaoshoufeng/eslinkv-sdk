<template lang="pug">
#screen(ref="canvas-wrapper", :style="editor.screen.screenStyle")
	.scene-container(:style="{ zIndex: 1 }")
		eslinkv-widget(
			v-for="item in editor.sceneWidgets[0]",
			:widget-type="item.widgetType",
			:key="item.id",
			:type="item.type",
			:config="item.config",
			:events="item.events",
			:eventTypes="item.eventTypes",
			:children="item.children",
			:settingData="item.settingData",
			:ref="item.id",
			:market="item.market",
			:style="item.config.widget.hide ? 'display: none' : ''",
			readonly)
		eslinkv-widget(
			v-for="item in editor.current.currentSceneIndex === 0 ? [] : editor.sceneWidgets[editor.current.currentSceneIndex]",
			:widget-type="item.widgetType",
			:key="item.id",
			:type="item.type",
			:config="item.config",
			:events="item.events",
			:eventTypes="item.eventTypes",
			:children="item.children",
			:settingData="item.settingData",
			:ref="item.id",
			:market="item.market",
			:style="item.config.widget.hide ? 'display: none' : ''",
			readonly)
	div(
		:class="currentAnimate(sceneId)",
		v-for="(sceneId, index) in editor.current.currentCreateSceneList",
		:key="sceneId",
		:style="{ zIndex: index + 2 }")
		eslinkv-widget(
			v-for="item in editor.sceneWidgets[sceneId]",
			:widget-type="item.widgetType",
			:key="item.id",
			:type="item.type",
			:config="item.config",
			:events="item.events",
			:eventTypes="item.eventTypes",
			:children="item.children",
			:settingData="item.settingData",
			:ref="item.id",
			:market="item.market",
			:style="item.config.widget.hide ? 'display: none' : ''",
			readonly)
</template>
<script lang="ts">
import loadMask from '../load-mask/index.vue'
import { Component, Vue } from 'vue-property-decorator'
import {Editor} from '@eslinkv/core'

@Component({
	components: {
		loadMask,
	},
})
export default class DView extends Vue {
	editor: Editor = Editor.Instance()

	currentAnimate(sceneId: string | number): string {
		if (this.editor.current.activeSceneId === sceneId || this.editor.current.currentSceneIndex === sceneId) {
			return `scene-container animated ${this.editor.current.sceneAnimate}`
		}
		return 'scene-container'
	}
}
</script>
<style lang="scss" scoped>
::v-deep {
	.load-mask {
		position: fixed !important;
	}
}

.scene-container {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	pointer-events: none;
}
</style>
