<template lang="pug">
	div
		d-right-swiper(title="echarts grids", :show="false")
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
		d-right-swiper-list(
			title="数据系列",
			prefix="系列",
			:list="editor.current.currentWidget.config.echartsSeries",
			@add-click="handleAddClick",
			@remove-click="index => handleRemoveClick(index)")
			template(v-slot="dataDefault")
				item-card(:echartsConfig="dataDefault.data")
		d-right-swiper-eye(
			title="数据过滤器",
			:enable="editor.current.currentWidget.config.echartsTooltip.show",
			@open-click="editor.current.currentWidget.config.echartsTooltip.show = true",
			@close-click="editor.current.currentWidget.config.echartsTooltip.show = false")
			d-right-control(label="触发条件")
				i-select(
					:style="{ marginBottom: '10px' }",
					v-model="editor.current.currentWidget.config.echartsTooltip.triggerOn")
					i-option(value="mousemove") mousemove
					i-option(value="click") click
					i-option(value="mousemove|click") mousemove|click
					i-option(value="none") none
			d-right-control(label="触发类型")
				i-select(
					:style="{ marginBottom: '10px' }",
					v-model="editor.current.currentWidget.config.echartsTooltip.trigger")
					i-option(value="item") item
					i-option(value="axis") axis
					i-option(value="none") none
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import func from '../../components-func/func.mx'
import ItemCard from './item-card.vue'

@Component({ components: { ItemCard } })
export default class DRightEcharts extends func {
	handleAddClick () {
		this.editor.current.currentWidget.config.echartsSeries.push({})
	}
	
	handleRemoveClick (index) {
		this.editor.current.currentWidget.config.echartsSeries.push({})
	}
}
</script>
