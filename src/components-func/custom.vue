<template lang="pug">
.d-manage-modal-control-base
	// START_PROD
	d-right-control(label="组件市场")
		i-select(
			v-model="editor.chooseWidget.config.widget.componentVersion",
			v-if="editor.chooseWidget.market",
			:style="{ marginRight: '10px', width: '156px' }")
			i-option(
				:value="editor.chooseWidget.componentVersion",
				v-for="(item, i) in versionList",
				:key="i") {{ item.componentVersion }}
		i-switch(v-model="editor.chooseWidget.market")
	// END_PROD
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'

@Component
export default class FuncCustom extends func {
	versionList = []

	// START_PROD
	async getVersionList() {
		const res = await this.$api.marketComponent.getVersionList({
			componentEnTitle: this.editor.chooseWidget.type,
		})
		this.versionList = res
	}

	mounted() {
		if (this.editor.chooseWidget.market) {
			this.getVersionList()
		}
	}
	// END_PROD
}
</script>
