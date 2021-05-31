<template lang="pug">
	div
		.children(v-for="(child, j) in childList" :key="j")
			widget-group-item(:child="child")
</template>
<script>
import WidgetGroupItem from './widget-group-item.vue'
import platform from '../../store/platform.store'

export default {
	name: 'WidgetGroup',
	props: ['childList'],
	components: { WidgetGroupItem },
	data() {
		return {
			platform: platform.state,
		}
	},
}
</script>
<style lang="scss" scoped></style>
