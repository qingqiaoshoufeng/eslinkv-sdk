<template lang="pug">
  .main-container(:style="{height: `calc(100% - ${platform.ruler.yRoom}px)`}")
    .d-editor-box.pos-r.fn-flex
      d-left-widget
      d-left-scene
      d-editor(ref="kanboardEditor")
      d-right-manage(v-if="platform.chooseWidgetState")
      d-right-setting(v-else)
</template>
<script lang="ts">
  import { Vue, Component, Provide } from 'vue-property-decorator'
  import platform from '../../store/platform.store.js'
  import dLeftWidget from '../d-left-widget/index.vue'
  import dLeftScene from '../d-left-scene/index.vue'
  import dEditor from '../d-editor/index.vue'
  import dRightManage from '../d-right-manage/index.vue'
  import dRightSetting from '../d-right-setting/index.vue'

  @Component({
    components: {
      dLeftWidget,
      dLeftScene,
      dRightManage,
      dRightSetting,
      dEditor,
    }
  })
  export default class dScreen extends Vue {
    platform = platform.state
    @Provide('kanboardEditor') kanboardEditor = this.$refs.kanboardEditor
  }
</script>
<style lang="scss" scoped>
.d-editor-box {
  width: 100%;
  height: 100%;
}

.main-container {
  width: 100%;
}

#kanban:-webkit-full-screen {
  width: 100%;
  height: 100%;
}
</style>
