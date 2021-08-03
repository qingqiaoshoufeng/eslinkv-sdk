<template lang="pug">
label.e-label(:style="{ marginTop: `${top}px`, marginBottom: `${bottom}px` }") {{ value }}
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class ELabel extends Vue {
	@Prop() value
	@Prop({ default: 4 }) top
	@Prop({ default: 4 }) bottom
}
</script>
<style lang="scss" scoped>
.e-label {
	min-height: 32px;
	line-height: 32px;
	color: #fafafa;
	display: block;
}
</style>
