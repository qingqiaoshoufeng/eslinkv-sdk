<template lang="pug">
#screen(ref="canvas-wrapper", :style="editor.screen.screenStyle")
	template(v-for="item in editor.showWidgets")
		eslinkv-normal(
			:widget-type="item.widgetType",
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
import loadMask from '../load-mask/index.vue'
import instance from '../../store/instance.store'
import { Component, Vue } from 'vue-property-decorator'
import Editor from '@/core/Editor'

@Component({
	components: {
		loadMask,
	},
})
export default class DView extends Vue {
	editor: Editor = Editor.Instance()
}
</script>
<style lang="scss" scoped>
::v-deep {
	.load-mask {
		position: fixed !important;
	}
}
</style>
