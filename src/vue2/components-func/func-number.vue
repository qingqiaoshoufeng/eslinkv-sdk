<template lang="pug">
d-right-control(:label="config.label")
	i-input-number(
		v-model="obj[inputKey]",
		@on-focus="event.inputFocus = true",
		@on-blur="event.inputFocus = false")
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'

@Component
export default class FuncNumber extends func {}
</script>
