<template lang="pug">
#d-screen.d-screen(
	:style="{ height: `calc(100% - ${ruler.yRoom}px)` }",
	@wheel="dScreenWheel")
	.d-editor-box.pos-r.fn-flex
		d-left-component
		d-left-scene
		d-editor(ref="kanboardEditor")
		d-right-manage(v-if="!platform.chooseWidgetId")
		d-right-setting(v-if="platform.chooseWidgetId")
		d-right-setting-more(v-if="platform.chooseWidgetArray.length > 1")
</template>
<script lang="ts">
import { Vue, Component, Provide } from 'vue-property-decorator'
import platform from '../../store/platform.store.js'
import ruler from '../../store/ruler.store.js'
import dLeftComponent from '../d-left-component/index.vue'
import dLeftScene from '../d-left-scene/index.vue'
import dEditor from '../d-editor/index.vue'
import dRightManage from '../d-right-manage/index.vue'
import dRightSetting from '../d-right-setting/index.vue'
import dRightSettingMore from '../d-right-setting-more/index.vue'
import { dScreenWheel } from '@/events'

@Component({
	components: {
		dLeftComponent,
		dLeftScene,
		dRightManage,
		dRightSetting,
		dRightSettingMore,
		dEditor,
	},
})
export default class dScreen extends Vue {
	platform = platform.state
	ruler = ruler.state
	dScreenWheel = dScreenWheel
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
