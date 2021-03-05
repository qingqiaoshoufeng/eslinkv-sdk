<template lang="pug">
	.d-manage-modal-control-base
		.d-manage-modal-control
			i-button(icon="md-sync" @click="handleSync") 强制刷新当前组件
</template>
<script lang="ts">
	import func from './func.mx'
	import {Component} from 'vue-property-decorator'
	import instance from '../store/instance.store'
	import platform from '../store/platform.store'

	@Component
	export default class FuncBase extends func {
		instance = instance.state
		platform = platform.state

		handleSync() {
			this.instance.kanboard.$refs[`widget_${this.platform.chooseWidgetId}`][0].$children[0].updateKey++
		}
	}
</script>
