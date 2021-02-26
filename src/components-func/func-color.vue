<template lang="pug">
	.d-manage-modal-control
		label {{config.label}}
		i-colorPicker(:alpha="true" v-model="obj[inputKey]")
</template>
<script lang="ts">
import func from './func.mx'
import {Component} from 'vue-property-decorator'

@Component
export default class FuncColor extends func {

}
</script>
