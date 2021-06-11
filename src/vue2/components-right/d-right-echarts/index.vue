<template lang="pug">
div(v-if="editor.currentWidget.widgetType === 'echarts'")
	d-right-swiper(title="echarts grids", :show="true")
		d-right-control(label="top")
			d-input(v-model="editor.currentWidget.config.echartsGrid.top")
		d-right-control(label="bottom")
			d-input(v-model="editor.currentWidget.config.echartsGrid.bottom")
		d-right-control(label="left")
			d-input(v-model="editor.currentWidget.config.echartsGrid.left")
		d-right-control(label="right")
			d-input(v-model="editor.currentWidget.config.echartsGrid.right")
		d-right-control(label="borderColor")
			i-color-picker(
				v-model="editor.currentWidget.config.echartsGrid.borderColor")
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import func from '../../components-func/func.mx'

@Component
export default class DRightEcharts extends func {}
</script>
