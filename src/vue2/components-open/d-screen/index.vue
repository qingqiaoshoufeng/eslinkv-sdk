<template lang="pug">
#d-screen.d-screen(:style="{ height: `calc(100% - ${editor.yRoom}px)` }")
	.d-editor-box.pos-r.fn-flex
		d-left-scene
		d-editor
		d-suspension
		d-right-manage(v-if="!editor.currentWidgetId")
		d-right-setting(v-if="editor.currentWidgetId")
		d-right-setting-more(v-if="editor.currentWidgetList && editor.currentWidgetList.length > 1")
	slot(v-if="editor.marketComponentLoading" name="loading")
		load-mask(:show="true") 加载中...
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import dLeftScene from '@/vue2/components-base/d-left-scene/index.vue'
import dEditor from '@/vue2/components-base/d-editor/index.vue'
import dRightManage from '@/vue2/components-right/d-right-manage/index.vue'
import dRightSetting from '@/vue2/components-right/d-right-setting/index.vue'
import dRightSettingMore from '@/vue2/components-right/d-right-setting-more/index.vue'
import dSuspension from '@/vue2/components-base/d-suspension/index.vue'
import Editor from '@/core/Editor'
import loadMask from '../load-mask/index.vue'

@Component({
	components: {
		loadMask,
		dLeftScene,
		dRightManage,
		dRightSetting,
		dRightSettingMore,
		dSuspension,
		dEditor,
	},
})
export default class dScreen extends Vue {
	editor: Editor = Editor.Instance()
}
</script>
<style lang="scss" scoped>
.d-editor-box {
	width: 100%;
	height: 100%;
}

.d-screen {
	width: 100%;
	min-width: 1088px;
}

#screen:-webkit-full-screen {
	width: 100%;
	height: 100%;
}
</style>
