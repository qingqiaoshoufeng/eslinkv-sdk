<template lang="pug">
i-switch.d-switch(:size="size", v-bind="{ ...$props, ...$attrs }", v-on="$listeners", v-model="currentVal")
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Switch } from 'view-design'
@Component({
	components: {
		'i-switch': Switch,
	},
})
export default class DInput extends Vue {
	@Prop() value
	@Prop({ default: 'small' }) size
	currentVal = this.value
	@Watch('value')
	onValueChange(val: boolean): void {
		this.currentVal = val
	}

	@Watch('currentVal')
	onCurrentVal(val: boolean): void {
		this.$emit('input', val)
	}
}
</script>
<style lang="scss" scoped>
.d-switch {
	&::v-deep {
		&.ivu-switch-checked {
			border-color: var(--primary-color);
			background-color: var(--primary-color);
		}
	}
}
</style>
