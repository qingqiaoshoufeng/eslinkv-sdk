<template lang="pug">
.widget-part(:style="styles")
	slot
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class widgetNormal extends Vue {
	@Prop() value
	@Prop() customConfig

	styles = (this.$parent as any).styles

	created(): void {
		this.$parent.$data.configValue = (this.$parent as any).parseConfigValue(
			this.value,
			this.customConfig,
		)
	}
}
</script>
