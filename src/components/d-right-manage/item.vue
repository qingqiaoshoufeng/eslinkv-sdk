<template lang="pug">
	component(:is="currentComponent[config.type]" :config="config" :parent="parent")
</template>
<script lang="ts">
	import { Component, Vue, Prop } from 'vue-property-decorator'
	
	@Component
	export default class DManageItem extends Vue {
		@Prop({ type: Object }) config: any
		@Prop({ type: Object }) parent: any
		currentComponent: any = {}

		created () {
			const components = require.context('../../components-func', true, /\.(vue)$/)
			components.keys().forEach(child => {
				const name = child.split('/')[1].replace('.vue', '')
				this.currentComponent[name] = components(child).default
			})
		}
	}
</script>
