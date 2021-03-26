<template lang="pug">
	d-right-modal.d-setting-modal(title="编辑器设置" :width="360" icon="ios-construct" :top="107")
		header.fn-flex.flex-row
			span 编辑器设置
		ul.d-scrollbar
			li.fn-flex.flex-row
				label 自动贴靠参考线
				i-switch(v-model="platform.autoAlignGuide")
			li.fn-flex.flex-row
				label 标尺可见
				i-switch(v-model="platform.ruler.rulerVisible")
			li.fn-flex.flex-row
				label 锁定参考线
				i-switch(v-model="platform.ruler.lockGuides")
			li.fn-flex.flex-row
				label 画布左边距
				i-input-number(v-model="platform.ruler.contentScrollLeft")
			li.fn-flex.flex-row
				label 画布上边距
				i-input-number(v-model="platform.ruler.contentScrollTop")
			li.fn-flex.flex-row
				label 画布缩放比例
				i-select(v-model="zoom")
					i-option(:value="item" v-for="(item) in zooms" :key="item") {{item}}
			li.fn-flex.flex-row
				label 平台版本
				span {{platform.version}}
</template>
<script lang="ts">
	import dRightModal from '../d-right-modal/index.vue'
	import { Component, Vue } from 'vue-property-decorator'
	import { Icon, Switch, InputNumber, Select, Option } from 'view-design'
	import platform from '../../store/platform.store'
	import BigNumber from 'bignumber.js'

	BigNumber.set({ DECIMAL_PLACES: 20 })
	@Component({
		components: {
			dRightModal,
			'i-icon': Icon,
			'i-switch': Switch,
			'i-input-number': InputNumber,
			'i-select': Select,
			'i-option': Option
		}
	})
	export default class DRightSetting extends Vue {
		platform: any = platform.state
		zooms = [
			'10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%',
			'110%', '120%', '130%', '140%', '150%', '160%', '170%', '180%', '190%', '200%',
			'210%', '220%', '230%', '240%', '250%', '260%', '270%', '280%', '290%', '300%',
			'310%', '320%', '330%', '340%', '350%', '360%', '370%', '380%', '390%', '400%'
		]

		get zoom () {
			const zoom = new BigNumber(this.platform.ruler.zoom)
			return `${zoom.multipliedBy(100)}%`
		}

		set zoom (val) {
			if (val) {
				const zoom = new BigNumber(val.replace('%', ''))
				this.platform.ruler.zoom = zoom.dividedBy(100)
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "../../../src/scss/conf";

	.d-setting-modal {
		header {
			flex: 0 0 auto;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			height: 42px;
			font-size: 14px;
			font-weight: bold;
			line-height: 42px;
			border-bottom: 1px solid $borderColor;
		}

		li {
			align-items: center;
			height: 32px;
			margin-top: 10px;

			label {
				margin-right: auto;
				font-size: 14px;
			}
		}

		.ivu-select {
			width: 80px;
		}
	}
</style>
