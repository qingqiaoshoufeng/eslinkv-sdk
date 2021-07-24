<template lang="pug">
input.e-input(
	:value="currentValue",
	:style="{ width }",
	@focus="$emit('focus', $event)",
	@blur="$emit('blur', $event)",
	@change="$emit('change', $event)",
	@input="$emit('input', $event.target.value)")
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component
export default class EInput extends Vue {
	@Prop({ default: '152px' }) width
	@Prop() value
	currentValue = ''

	@Watch('value')
	valueChange(val): void {
		this.currentValue = val
	}
	mounted(): void {
		this.currentValue = this.value
	}
}
</script>
<style lang="scss" scoped>
.e-input {
	padding: 4px 8px;
	color: #fafafa;
	background-color: var(--component-background);
	border: 1px solid var(--border-color-base);
	border-radius: 2px;
	box-shadow: none;

	&:focus {
		border-color: var(--primary-color);
	}

	&:hover {
		border-color: var(--primary-color);
	}
}
</style>
