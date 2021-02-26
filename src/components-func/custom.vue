<template lang="pug">
	.d-manage-modal-control-base
		.d-manage-modal-control
			i-button(icon="md-sync" @click="handleSync") 强制刷新当前组件
</template>
<script lang="ts">
	import func from './func.mx'
	import {Component} from 'vue-property-decorator'

	@Component
	export default class FuncBase extends func {
		handleSync() {

		}
	}
</script>
