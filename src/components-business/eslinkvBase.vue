<template lang="pug">
	div(:styles="styles")
		slot
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class eslinkvBase extends Vue {
	@Prop() value
	@Prop() customConfig
	
	styles = this.$parent.styles
	
	created() {
		this.$parent.$data.configValue = this.$parent.parseConfigValue(
			this.value,
			this.customConfig,
		)
	}
}
</script>
<style lang="scss">

</style>
