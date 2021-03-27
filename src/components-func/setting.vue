<template lang="pug">
  .d-manage-modal-control-setting
    .d-manage-modal-control
      label 自动贴靠参考线
      i-switch(v-model="platform.autoAlignGuide")
    .d-manage-modal-control
      label 标尺可见
      i-switch(v-model="platform.ruler.rulerVisible")
    .d-manage-modal-control
      label 锁定参考线
      i-switch(v-model="platform.ruler.lockGuides")
    .d-manage-modal-control
      label 画布左边距
      i-input-number(v-model="platform.ruler.contentScrollLeft")
    .d-manage-modal-control
      label 画布上边距
      i-input-number(v-model="platform.ruler.contentScrollTop")
    .d-manage-modal-control
      label 画布缩放比例
      i-select(v-model="zoom")
        i-option(:value="item" v-for="(item) in zooms" :key="item") {{item}}
    .d-manage-modal-control
      label 平台版本
      span {{platform.version}}
</template>
<script lang="ts">
	import { Component } from 'vue-property-decorator'
	import BigNumber from 'bignumber.js'
	import func from './func.mx'

	BigNumber.set({ DECIMAL_PLACES: 20 })
	@Component
	export default class DRightSetting extends func {
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
</style>
