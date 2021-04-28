<template lang="pug">
.d-screen#d-screen(:style="{ height: `calc(100% - ${ruler.yRoom}px)` }")
	.d-editor-box.pos-r.fn-flex
		d-left-component
		d-left-scene
		d-editor(ref="kanboardEditor")
		d-right-manage(v-if="platform.chooseWidgetState")
		d-right-setting(v-else)
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

@Component({
	components: {
		dLeftComponent,
		dLeftScene,
		dRightManage,
		dRightSetting,
		dEditor,
	},
})
export default class dScreen extends Vue {
	platform = platform.state
	ruler = ruler.state
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
