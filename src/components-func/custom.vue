<template lang="pug">
.d-manage-modal-control-base
	.d-manage-modal-control(v-if="item && item.config.config.colorTheme")
		label 主题皮肤
		.d-manage-modal-control-right
			span 尽情期待
	.d-manage-modal-control
		label
		.d-manage-modal-control-right
			i-button(icon="md-sync", @click="handleSync", type="primary") 强制刷新当前组件
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import instance from '../store/instance.store'
import platform from '../store/platform.store'
// import { colorTheme } from '../../packages/index.js'

@Component
export default class FuncCustom extends func {
	instance = instance.state
	platform = platform.state
	// colorTheme = colorTheme

	handleSync() {
		this.instance.kanboard.$refs[
			`widget_${this.platform.chooseWidgetId}`
		][0].$children[0].updateKey++
	}
}
</script>
