<template lang="pug">
  .d-manage-modal-control-setting

</template>
<script lang="ts">
	import { Component } from 'vue-property-decorator'
	import BigNumber from 'bignumber.js'
	import func from './func.mx'

	BigNumber.set({ DECIMAL_PLACES: 20 })
	@Component
	export default class DRightSetting extends func {

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
