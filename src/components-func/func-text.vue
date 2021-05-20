<template lang="pug">
d-right-control(:label="config.label")
	span.d-manage-modal-control-text {{ obj[inputKey] }}
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'

@Component
export default class FuncText extends func {}
</script>
