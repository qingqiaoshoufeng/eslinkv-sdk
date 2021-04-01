<template lang="pug">
  .d-manage-modal-control
    label {{config.label}}
    .d-manage-modal-control-right
      i-switch(v-model="obj[inputKey]")
</template>
<script lang="ts">
	import func from './func.mx'
	import { Component } from 'vue-property-decorator'

	@Component
	export default class FuncSwitch extends func {

	}
</script>
