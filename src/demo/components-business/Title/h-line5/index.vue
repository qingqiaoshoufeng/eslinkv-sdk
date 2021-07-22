<template lang="pug">
widget-normal(
	:value="value",
	:customConfig="customConfig",
	:setting="setting",
	:customEvents="{ testEvent: test1, test2: test2 }"
	:settingData="settingD")
	.chart(:id="id")
</template>
<script lang="ts">
import getOption from './options'
import widgetMixin from '@/vue2/mixins'
import { Component, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import widgetNormal from '@/vue2/ui/Widget/normal.vue'
import { value, customConfig, setting, settingData } from './index.component'

@Component({ components: { widgetNormal } })
export default class extends mixins(widgetMixin) {
	value = value
	customConfig = customConfig
	setting = setting
	settingD = settingData

	setOption(): void {
		const option = getOption(this.config.config)
		if (this.settingData['y'])
			this.settingData['y'].forEach((child, index) => {
				option.series[index].data = this.data.map(item => item[child])
			})
		if (this.settingData['x'])
			this.settingData['x'].forEach((child, index) => {
				option.xAxis[index].data = this.data.map(item => item[child])
			})
		this.instance.setOption(option)
	}

	@Watch('settingData', { deep: true })
	settingDataChange(): void {
		if (this.id) {
			this.$nextTick(() => {
				this.instance = echarts.init(document.getElementById(this.id))
				this.setOption(this.data)
			})
		}
	}

	@Watch('data')
	dataChange(val): void {
		if (this.id) {
			this.$nextTick(() => {
				this.instance = echarts.init(document.getElementById(this.id))
				this.setOption(val)
			})
		}
	}
	
	test1 (a) {
		console.log('test1')
		console.log(a)
	}	
	test2 (a) {
		console.log('test2')
		console.log(a)
	}
}
</script>
<style lang="scss" scoped>
.chart {
	width: 100%;
	height: 100%;
}
</style>
