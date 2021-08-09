<template lang="pug">
div
	d-right-control(label="类型")
		i-select(
			:style="{ marginBottom: '10px' }",
			v-model="echartsConfig.type",
			placeholder="类型")
			i-option(value="bar") 柱形
			i-option(value="line") 折线
			i-option(value="area") 面积
	d-right-control(label="显示名")
		d-input(
			v-model="echartsConfig.name",
			:style="{ width: '100px' }")
	d-right-control(label="系列值")
		d-input(
			v-model="echartsConfig.seriesYKey",
			:style="{ width: '100px' }")
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import func from '@/vue2/components-func/func.mx'
import dCode from '@/vue2/components-right/d-code/index.vue'

@Component({ components: { dCode } })
export default class FuncData extends func {
	@Prop() activeIndex
	@Prop() echartsConfig

	
}
</script>
