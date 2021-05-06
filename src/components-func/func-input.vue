<template lang="pug">
.d-manage-modal-control
	label {{ config.label }}
	.d-manage-modal-control-right
		i-input(v-model="obj[inputKey]" @on-focus="event.inputFocus=true" @on-blur="event.inputFocus=false")
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'

@Component
export default class FuncInput extends func {}
</script>
