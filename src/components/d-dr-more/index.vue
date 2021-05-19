<template lang="pug">
.dr-more.pos-a(:style="style")
	d-dr-kuang
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import platform from '@/store/platform.store.js'
import dDrKuang from '../../components/d-dr-kuang/index.vue'
@Component({
	components: {
		dDrKuang,
	},
})
export default class DDrMore extends Vue {
	platform = platform.state
	get style() {
		return {
			transform: `translate3d(${this.platform.chooseWidgetArrayConfig.left}px, ${this.platform.chooseWidgetArrayConfig.top}px,0)`,
			width: this.platform.chooseWidgetArrayConfig.width + 'px',
			height: this.platform.chooseWidgetArrayConfig.height + 'px',
			zIndex: this.platform.chooseWidgetArrayConfig.z,
		}
	}
}
</script>
