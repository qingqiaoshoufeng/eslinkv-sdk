<template lang="pug">
.dr-more.pos-a(:style="style")
	d-dr-kuang
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import dDrKuang from '../../components/d-dr-kuang/index.vue'
@Component({
	components: {
		dDrKuang,
	},
})
export default class DDrMore extends Vue {
	screen = {}
	get style() {
		if (!this.screen.chooseWidgetArrayConfig) return {}
		return {
			transform: `translate3d(${this.screen.chooseWidgetArrayConfig.left}px, ${this.screen.chooseWidgetArrayConfig.top}px,0)`,
			width: this.screen.chooseWidgetArrayConfig.width + 'px',
			height: this.screen.chooseWidgetArrayConfig.height + 'px',
			zIndex: this.screen.chooseWidgetArrayConfig.z,
		}
	}
	mounted() {
		this.screen = this.$screen
	}
}
</script>
