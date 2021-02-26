<template lang="pug">
	.d-manage-modal-control
		label {{config.label}}
		i-input-number(v-model="obj[inputKey]")
</template>
<script lang="ts">
	import func from './func.mx'
	import {Component} from 'vue-property-decorator'

	@Component
	export default class FuncNumber extends func {

	}
</script>
