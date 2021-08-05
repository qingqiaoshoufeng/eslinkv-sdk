<template lang="pug">
#screen(ref="canvas-wrapper", :style="editor.screen.screenStyle")
	d-scene(:zIndex="1")
		eslinkv-widget(
			v-for="item in editor.sceneWidgets[0]",
			:widget-type="item.widgetType",
			:key="item.id",
			:type="item.type",
			:config="item.config",
			:events="item.events",
			:animation="item.animation",
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
			:animation="item.animation",
			:eventTypes="item.eventTypes",
			:children="item.children",
			:settingData="item.settingData",
			:ref="item.id",
			:market="item.market",
			:style="item.config.widget.hide ? 'display: none' : ''",
			readonly)
	d-scene(
		v-for="(sceneId, index) in editor.current.currentCreateSceneList",
		:key="sceneId",
		:sceneId="sceneId",
		:zIndex="index + 2")
		eslinkv-widget(
			v-for="item in editor.sceneWidgets[sceneId]",
			:widget-type="item.widgetType",
			:key="item.id",
			:type="item.type",
			:config="item.config",
			:events="item.events",
			:animation="item.animation",
			:eventTypes="item.eventTypes",
			:children="item.children",
			:settingData="item.settingData",
			:ref="item.id",
			:market="item.market",
			:style="item.config.widget.hide ? 'display: none' : ''",
			readonly)
	slot(v-if="editor.marketComponentLoading", name="loading")
		load-mask(:show="true") 加载中...
</template>
<script lang="ts">
import loadMask from '../load-mask/index.vue'
import dScene from '../../components-base/d-scene/index.vue'
import { Component, Vue } from 'vue-property-decorator'
import Editor from '@/core/Editor'
import { getQueryString } from '@/vue2/utils'
import { loadJs, loadCss } from '@/core/utils'
import { linkList } from '@/vue2/api/screen.api.js'

@Component({
	components: {
		dScene,
		loadMask,
	},
})
export default class DView extends Vue {
	editor: Editor = Editor.Instance()
	currentLayoutMode = getQueryString('layoutMode')

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

	async loadExtraLink() {
		const res = await linkList({ screenId: this.$route.params.id })
		if (!res.length) return
		const arr = []
		for (let i = 0; i < res.length; i++) {
			if (res[i].linkType === 'javascript' || res[i].linkType === 'iconfont') {
				arr.push(loadJs(res[i].linkUrl, res[i].linkUrl))
			} else if (res[i].linkType === 'css') {
				arr.push(loadCss(res[i].linkUrl, res[i].linkUrl))
			}
		}
		await Promise.all(arr)
	}

	mounted(): void {
		document.documentElement.addEventListener('keydown', this.init)
	}

	async created() {
		await this.loadExtraLink()
	}
}
</script>
<style lang="scss" scoped>
::v-deep {
	.load-mask {
		position: fixed !important;
	}
}
</style>
