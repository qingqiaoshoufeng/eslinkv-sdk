<template lang="pug">
div(:style="styles", v-if="data")
	.fn-flex.flex-row.h-title-1
		.h-title-1-icon
		h2(@click="__handleClick__(test)") {{ data.title }}
</template>
<script lang="ts">
import widgetMixin from '../../../../mixins'
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { value, customConfig } from './index.component'

@Component
export default class extends mixins(widgetMixin) {
	test = {
		data: {
			value: [
				{
					x: ['07/11', '07/13', '07/14', '07/15', '07/16', '07/17'],
					y: [250, 350, 120, 290, 240, 250],
					name: '数据1',
				},
				{
					x: ['08/12', '08/13', '08/14', '08/15', '08/16', '08/17'],
					y: [150, 250, 420, 390, 140, 350],
					name: '数据2',
				},
			],
		},
	}

	created() {
		;(this as any).configValue = (this as any).parseConfigValue(
			value,
			customConfig,
		)
	}
}
</script>
<style lang="scss">
.h-title-1-icon {
	width: 34px;
	height: 34px;
	margin-right: 9px;
	background-image: url('./h-title1-1.svg');
}

.h-title-1 {
	align-items: center;
	padding-bottom: 8px;
	border-bottom: 1px solid var(--white_04);

	h2 {
		font-size: 24px;
		font-weight: 600;
		color: var(--white);
	}
}
</style>
