<template lang="pug">
.d-manage-modal-control-base(v-if="screen.chooseWidgetId")
	// START_PROD
	d-right-control(label="组件市场")
		i-select(
			v-model="screen.chooseWidget.config.widget.componentVersion",
			v-if="screen.chooseWidget.market",
			:style="{ marginRight: '10px', width: '156px' }")
			i-option(
				:value="screen.chooseWidget.componentVersion",
				v-for="(item, i) in versionList",
				:key="i") {{ item.componentVersion }}
		i-switch(v-model="screen.chooseWidget.market")
	// END_PROD
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import event from '../store/event.store'

@Component
export default class FuncCustom extends func {
	event = event.state
	versionList = []

	// START_PROD
	async getVersionList() {
		const res = await this.$api.marketComponent.getVersionList({
			componentEnTitle: this.screen.chooseWidget.type,
		})
		this.versionList = res
	}

	mounted() {
		if (this.screen.chooseWidget.market) {
			this.getVersionList()
		}
	}
	// END_PROD
}
</script>
