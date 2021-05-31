<template lang="pug">
#d-screen.d-screen(
	:style="{ height: `calc(100% - ${ruler.yRoom}px)` }",
	@wheel="dScreenWheel")
	.d-editor-box.pos-r.fn-flex
		d-left-component
		d-left-scene
		d-editor(ref="kanboardEditor")
		d-right-manage(v-if="!screen.chooseWidgetId")
		d-right-setting(v-if="screen.chooseWidgetId")
		d-right-setting-more(
			v-if="screen.chooseWidgetArray && screen.chooseWidgetArray.length > 1")
</template>
<script lang="ts">
import { Vue, Component, Provide } from 'vue-property-decorator'
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
	ruler = {}
	screen = {}
	dScreenWheel = dScreenWheel
	@Provide('kanboardEditor') kanboardEditor = this.$refs.kanboardEditor

	mounted() {
		this.ruler = this.$ruler
		this.screen = this.$screen
	}
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
