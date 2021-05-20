<template lang="pug">
.d-manage-modal-control-base
	// START_PROD
	d-right-control(label="组件市场")
		i-select(
			v-model="item.config.widget.componentVersion",
			v-if="item.market",
			:style="{ marginRight: '10px', width: '156px' }")
			i-option(
				:value="item.componentVersion",
				v-for="(item, i) in versionList",
				:key="i") {{ item.componentVersion }}
		i-switch(v-model="item.market")
	// END_PROD
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import platform from '../store/platform.store'
import event from '../store/event.store'

@Component
export default class FuncCustom extends func {
	platform = platform.state
	event = event.state
	versionList = []

	// START_PROD
	async getVersionList() {
		const res = await this.$api.marketComponent.getVersionList({
			componentEnTitle: this.item.type,
		})
		this.versionList = res
	}

	created() {
		if (this.item.market) {
			this.getVersionList()
		}
	}
	// END_PROD
}
</script>
