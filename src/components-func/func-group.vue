<template lang="pug">
.d-manage-modal-control
	i-collapse(simple)
		i-panel {{ config.label }}
			.content(slot="content")
				.wrap(v-for="(v, n) in obj[inputKey]", :key="n")
					DManageItem(
						:config="k",
						v-for="(k, i) in config.children",
						:key="i",
						:parent="v")
					.fn-flex
						i-icon.pointer(
							:style="{ marginLeft: 'auto' }",
							title="删除",
							type="ios-trash-outline",
							color="#fff",
							size="14",
							@click="remove(n)")
				.fn-flex
					i-icon.pointer(
						:style="{ marginLeft: 'auto' }",
						title="新增",
						type="ios-add-circle-outline",
						color="#fff",
						size="14",
						@click="add")
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import DManageItem from '../components/d-right-setting/item.vue'

@Component({ components: { DManageItem } })
export default class FuncGroup extends func {
	add() {
		const child = {}
		this.config.children.forEach(v => {
			child[v.prop] = ''
		})
		this.obj[this.inputKey].push(child)
	}

	remove(n) {
		this.obj[this.inputKey].splice(n, 1)
	}
}
</script>
<style lang="scss" scoped>
.wrap {
	padding: 10px;
	margin-bottom: 10px;
	border: 1px solid #393b4a;
}
</style>
