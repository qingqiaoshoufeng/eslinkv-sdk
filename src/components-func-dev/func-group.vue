<template lang="pug">
.func-group.fn-flex.flex-column
	d-right-swiper(
		:title="config.label",
		:icon="icon",
		@icon-click="value => handleClick(value, n)",
		v-for="(v, n) in obj[inputKey]",
		:key="n")
		DManageItem(
			:config="k",
			v-for="(k, i) in config.children",
			:key="i",
			:parentProp="inputKey"
			:parentIndex="n")
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import DManageItem from '../components/d-right-setting/item.vue'

@Component({ components: { DManageItem } })
export default class FuncGroup extends func {
	get icon() {
		if (this.obj[this.inputKey].length > 1) {
			return ['ios-add-circle-outline', 'ios-trash-outline']
		} else {
			return ['ios-add-circle-outline']
		}
	}

	handleClick(value, index) {
		if (value === 'ios-add-circle-outline') {
			const child = {}
			this.config.children.forEach(v => {
				child[v.prop] = ''
			})
			this.obj[this.inputKey].push(child)
		}
		if (value === 'ios-trash-outline') {
			this.obj[this.inputKey].splice(index, 1)
		}
	}
}
</script>
<style lang="scss" scoped>
.func-group {
	&::v-deep + .d-manage-modal-control {
		margin-top: 10px;
	}
}
</style>
