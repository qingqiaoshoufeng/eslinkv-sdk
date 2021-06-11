<template lang="pug">
widget-echarts(:value="value", :customConfig="customConfig")
	.chart(:id="id")
</template>
<script lang="ts">
import widgetMixin from '@/vue2/mixins'
import { Component, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import widgetEcharts from '@/vue2/ui/Widget/echarts.vue'
import { value, customConfig } from './index.component'

@Component({ components: { widgetEcharts } })
export default class extends mixins(widgetMixin) {
	value = value
	customConfig = customConfig

	setOption(data): void {
		const grid = this.config.echartsGrid
		const series = this.config.echartsSeries
		this.config.echartsYAnalysis.forEach((key, index) => {
			series[index].data = data.map(item => item[key])
		})
		const yAxis = this.config.echartsYAxis
		const xAxis = this.config.echartsXAxis
		this.config.echartsXAnalysis.forEach((key, index) => {
			xAxis[index].data = data.map(item => item[key])
		})
		this.instance.setOption({
			grid,
			series,
			xAxis,
			yAxis,
		})
	}

	@Watch('data', { deep: true, immediate: true })
	dataHandle(val): void {
		if (this.id && val) {
			this.$nextTick(() => {
				this.instance = echarts.init(document.getElementById(this.id))
				this.setOption(val)
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.chart {
	width: 100%;
	height: 100%;
}
</style>
