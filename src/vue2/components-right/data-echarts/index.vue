<template lang="pug">
d-right-swiper(title="echarts 数据处理")
	d-right-control(label="X轴数据")
		i-select(
			v-model="editor.currentWidget.config.echartsXAnalysis",
			:multiple="true")
			i-option(v-for="item in echartsAnalysis", :value="item") {{ item }}
	d-right-control(label="Y轴数据")
		i-select(
			v-model="editor.currentWidget.config.echartsYAnalysis",
			:multiple="true")
			i-option(v-for="item in echartsAnalysis", :value="item") {{ item }}
</template>
<script lang="ts">
import func from '@/vue2/components-func/func.mx'
import { Component } from 'vue-property-decorator'

@Component
export default class DataEcharts extends func {
	get echartsAnalysis() {
		const data = JSON.parse(this.editor.currentWidget.config.api.data)
		let result = []
		data.forEach(item => {
			for (const key in item) {
				if (result.indexOf(key) === -1) {
					result.push(key)
				}
			}
		})
		return result
	}
}
</script>
