<template lang="pug">
.dr-more.pos-a(:style="style")
	d-dr-kuang
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import dDrKuang from '../../components/d-dr-kuang/index.vue'
import Editor from '@/core/Editor'
@Component({
	components: {
		dDrKuang,
	},
})
export default class DDrMore extends Vue {
	editor = Editor.Instance()
	get style() {
		if (!this.editor.chooseWidgetArrayConfig) return {}
		return {
			transform: `translate3d(${this.editor.chooseWidgetArrayConfig.left}px, ${this.editor.chooseWidgetArrayConfig.top}px,0)`,
			width: this.editor.chooseWidgetArrayConfig.width + 'px',
			height: this.editor.chooseWidgetArrayConfig.height + 'px',
			zIndex: this.editor.chooseWidgetArrayConfig.z,
		}
	}
}
</script>
