<template lang="pug">
.d-manage-modal-control-base
	.d-manage-modal-control(v-if="item && item.config.config.colorTheme")
		label 色盘
		.d-manage-modal-control-right
			i-color-picker(
				:alpha="true",
				size="small",
				v-model="colorDisk[index]",
				@on-change="val => colorDiskChange(val, index)",
				v-for="(item, index) in item.config.config.colorTheme.colorDisk",
				:style="{ marginLeft: '10px', marginBottom: '10px' }")
	.d-manage-modal-control(v-if="item && item.config.config.colorTheme")
		label
		.d-manage-modal-control-right
			i-button(@click="handleResetColor", type="primary") 一键恢复官方主题色盘
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import instance from '../store/instance.store'
import platform from '../store/platform.store'
import { colorTheme } from '../../packages/index.js'

@Component
export default class FuncAnimation extends func {
	instance = instance.state
	platform = platform.state
	get colorDisk() {
		let obj = {}
		this.item.config.config.colorTheme.colorDisk.map((item, index) => {
			obj[index] = item
		})
		return obj
	}

	handleResetColor() {
		this.item.config.config.colorTheme = colorTheme
		this.handleSync()
	}

	colorDiskChange(val, index) {
		this.item.config.config.colorTheme.colorDisk[index] = val
		this.handleSync()
	}

	handleSync() {
		this.instance.kanboard.$refs[
			`widget_${this.platform.chooseWidgetId}`
		][0].$children[0].updateKey++
	}
}
</script>
