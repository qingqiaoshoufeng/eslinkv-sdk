<template lang="pug">
.d-manage-modal-control-base
	// START_PROD
	.d-manage-modal-control
		label 组件市场
		.d-manage-modal-control-right
			i-select(
				v-model="item.config.widget.componentVersion",
				v-if="item.market",
				:style="{ marginRight: '10px', width: '156px' }",
				:disabled="platform.chooseWidgetState")
				i-option(
					:value="item.componentVersion",
					v-for="(item, i) in versionList",
					:key="i") {{ item.componentVersion }}
			i-switch(v-model="item.market")
	// END_PROD
	.d-manage-modal-control
		label 自动贴靠参考线
		.d-manage-modal-control-right
			i-switch(v-model="platform.autoAlignGuide")
	.d-manage-modal-control
		label
		.d-manage-modal-control-right
			i-button(icon="md-sync", @click="handleSync", type="primary") 强制刷新当前组件
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import instance from '../store/instance.store'
import platform from '../store/platform.store'

@Component
export default class FuncCustom extends func {
	instance = instance.state
	platform = platform.state
	versionList = []

	handleSync() {
		this.instance.kanboard.$refs[
			`widget_${this.platform.chooseWidgetId}`
		][0].$children[0].updateKey++
	}

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
