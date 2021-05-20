<template lang="pug">
.d-manage-modal-control-base
	d-right-control(label="色盘")
		i-color-picker(
			:alpha="true",
			size="small",
			v-model="colorDiskArray[index]",
			@on-change="val => colorDiskChange(val, index)",
			v-for="(item, index) in colorTheme.colorDisk",
			:style="{ marginLeft: '10px', marginBottom: '10px' }")
	d-right-control
		i-button(@click="handleResetColor", type="primary") 一键恢复官方主题色盘
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import instance from '../store/instance.store'
import platform from '../store/platform.store'
import { colorTheme } from '../../packages/config.default.js'

@Component
export default class FuncAnimation extends func {
	instance = instance.state
	platform = platform.state

	get colorTheme() {
		return this.item.config.config.colorTheme
			? this.item.config.config.colorTheme
			: colorTheme
	}

	get colorDiskArray() {
		let obj = {}
		const theme = this.colorTheme
		theme.colorDisk.map((item, index) => {
			obj[index] = item
		})
		return obj
	}

	handleResetColor() {
		this.item.config.config.colorTheme = colorTheme
		this.handleSync()
	}

	colorDiskChange(val, index) {
		if (!this.item.config.config.colorTheme) {
			this.item.config.config.colorTheme = {}
		}
		if (!this.item.config.config.colorTheme.colorDisk) {
			this.item.config.config.colorTheme.colorDisk = []
		}
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
