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
	slot(v-if="editor.marketComponentLoading" name="loading")
		load-mask(:show="true") 加载中...
</template>
<script lang="ts">
import loadMask from '../load-mask/index.vue'
import { Component, Vue } from 'vue-property-decorator'
import Editor from '@/core/Editor'
import { getQueryString } from '@/vue2/utils'

@Component({
	components: {
		loadMask,
	},
})
export default class DView extends Vue {
	editor: Editor = Editor.Instance()
	currentLayoutMode = getQueryString('layoutMode')
	currentAnimate(sceneId: string | number): string {
		if (this.editor.current.activeSceneId === sceneId || this.editor.current.currentSceneIndex === sceneId) {
			return `scene-container animated ${this.editor.current.sceneAnimate}`
		}
		return 'scene-container'
	}
	beforeDestroy(): void {
		document.documentElement.removeEventListener('keydown', this.init)
	}

	layoutModeChange(): void {
		switch (this.currentLayoutMode) {
			case 'full-size':
				this.currentLayoutMode = 'full-width'
				break
			case 'full-width':
				this.currentLayoutMode = 'full-height'
				break
			case 'full-height':
				this.currentLayoutMode = 'full-size'
				break
			default:
				this.currentLayoutMode = 'full-size'
		}
		document.getElementById('screen').style.transform = this.editor.changeLayoutMode(this.currentLayoutMode)
	}

	init(e: KeyboardEvent): void {
		if (
			(e.ctrlKey === true || e.metaKey === true) &&
			(e.which === 189 ||
				e.which === 187 ||
				e.which === 173 ||
				e.which === 61 ||
				e.which === 107 ||
				e.which === 109)
		) {
			e.preventDefault()
		}
		if (e.keyCode === 88) {
			this.layoutModeChange()
		}
	}

	mounted(): void {
		document.documentElement.addEventListener('keydown', this.init)
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
