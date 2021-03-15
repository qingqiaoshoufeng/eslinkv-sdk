<template lang="pug">
	transition(name="fade")
		.load-mask.pos-a.fn-flex(v-if="show" :style="`background-color: ${backgroundColor}; color: ${color}; font-size: ${fontSize}`")
			img(src="./loading.svg" :width="iconSize")
			slot {{ text }}
</template>
<script lang="ts">
	import { Vue, Component, Prop } from 'vue-property-decorator'

	@Component
	class loadMask extends Vue {
		@Prop({ default: 'rgba(0, 0, 0, 0.6)' }) backgroundColor: string
		@Prop({ default: true }) show: boolean
		@Prop({ default: '#e2e2e2' }) color: string
		@Prop({ default: '1.5em' }) fontSize: string
		@Prop({ default: 48 }) iconSize: number
		@Prop({ default: '请稍后…' }) text: string
	}

	export default loadMask
</script>
<style lang="scss">
	.load-mask {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 999999;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		line-height: 3;
	}
</style>
