<template lang="pug">
    .widget-part(:style="styles")
        .fn-flex.flex-row.h-title-1
            .h-title-1-icon
            h2 {{data&&data.title}}
</template>
<script lang="ts">
	import widgetMixin from '../../../../mixins'
	import { Component } from 'vue-property-decorator'
	import { mixins } from 'vue-class-component'
	import { value, customConfig } from './index.component'

  @Component
	export default class extends mixins(widgetMixin) {
        created () {
            // this.configValue = this.parseConfigValue(value)
            this.configValue = this.parseConfigValue(value, customConfig)
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
		border-bottom: 1px solid rgba(255, 255, 255, 0.4);

		h2 {
			font-size: 24px;
			font-weight: 600;
			color: #fff;
		}
	}

</style>

