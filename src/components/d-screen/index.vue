<template lang="pug">
#d-screen.d-screen(
	:style="{ height: `calc(100% - ${editor.yRoom}px)` }",
	@wheel="editor.wheelRulerContentZoom($event)")
	.d-editor-box.pos-r.fn-flex
		d-left-widget
		d-left-scene
		d-editor(ref="kanboardEditor")
		d-right-manage(v-if="!screen.chooseWidgetId")
		d-right-setting(v-if="screen.chooseWidgetId")
		d-right-setting-more(
			v-if="screen.chooseWidgetArray && screen.chooseWidgetArray.length > 1")
</template>
<script lang="ts">
import { Vue, Component, Provide } from 'vue-property-decorator'
import dLeftWidget from '../d-left-widget/index.vue'
import dLeftScene from '../d-left-scene/index.vue'
import dEditor from '../d-editor/index.vue'
import dRightManage from '@/components-right/d-right-manage/index.vue'
import dRightSetting from '@/components-right/d-right-setting/index.vue'
import dRightSettingMore from '@/components-right/d-right-setting-more/index.vue'
import Editor from '@/core/Editor'

@Component({
	components: {
		dLeftWidget,
		dLeftScene,
		dRightManage,
		dRightSetting,
		dRightSettingMore,
		dEditor,
	},
})
export default class dScreen extends Vue {
	editor = Editor.Instance()
	screen = this.$screen
	@Provide('kanboardEditor') kanboardEditor = this.$refs.kanboardEditor
}
</script>
<style lang="scss" scoped>
.d-editor-box {
	width: 100%;
	height: 100%;
}

.d-screen {
	width: 100%;
}

#screen:-webkit-full-screen {
	width: 100%;
	height: 100%;
}
</style>
