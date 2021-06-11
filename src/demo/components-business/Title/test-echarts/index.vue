<template lang="pug">
widget-echarts(:value="value", :customConfig="customConfig")
	.fn-flex.flex-row.h-title-1(v-if="data")
		.h-title-1-icon
		h2(@click="__handleClick__(test)") {{ data.title }} {{ config.config.title }}
</template>
<script lang="ts">
import widgetMixin from '@/vue2/mixins'
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import widgetEcharts from '@/vue2/ui/Widget/echarts.vue'
import { value, customConfig } from './index.component'

@Component({ components: { widgetEcharts } })
export default class extends mixins(widgetMixin) {
	value = value
	customConfig = customConfig
}
</script>
