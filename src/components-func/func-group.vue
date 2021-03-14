<template lang="pug">
	.d-manage-modal-control
		i-collapse(simple)
			i-panel {{config.label}}
				.content(slot="content")
					.wrap(v-for="(v, n) in obj[inputKey]" :key="n")
						DManageItem(:config="k" v-for="(k, i) in config.children" :key="i" :parent="v")
						i-button(type="warning" @click="remove(n)") 删除
					i-button(type="primary").add(@click="add") 新增
</template>
<script lang="ts">
	import func from './func.mx'
	import { Component } from 'vue-property-decorator'
	import DManageItem from '../components/d-right-manage/item.vue'
	import Style from './style.vue'

	@Component({ components: { Style, DManageItem } })
	export default class FuncGroup extends func {
		add () {
			const child = {}
			this.config.children.forEach(v => {
				child[v.prop] = ''
			})
			this.obj[this.inputKey].push(child)
		}

		remove (n) {
			this.obj[this.inputKey].splice(n, 1)
		}
	}
</script>
<style scoped lang="scss">
	.wrap {
		padding: 10px;
		margin-bottom: 10px;
		border: 1px solid #ddd;
	}
</style>
