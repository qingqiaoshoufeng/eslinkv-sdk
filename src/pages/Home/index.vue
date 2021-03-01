<template lang="pug">
	ul
		li
			router-link(to="/editor") 编辑器
		li
			router-link(to="/changelog") 更新日志
		li
			router-link(to="/help/HowToUseMarket") 帮助文档
</template>
<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator'

	@Component
	export default class Home extends Vue {
	}
</script>
<style lang="scss">
	
</style>
