<template lang="pug">
d-right-swiper-list(
	title="场景事件",
	@add-click="handleAddClick",
	:list="item.config.event.scene",
	@remove-click="handleRemoveClick")
	template(v-slot="dataDefault")
		.d-manage-modal-control
			.fn-flex.flex-column(:style="{ width: '100%', paddingRight: '10px' }")
				i-select(
					clearable,
					:style="{ marginBottom: '10px' }",
					v-model="item.config.event.scene[dataDefault.activeIndex].type",
					placeholder="事件类型")
					i-option(value="openScene") 打开场景
					i-option(value="closeScene") 关闭场景
					i-option(value="changeScene") 切换场景
				i-select(
					:style="{ marginBottom: '10px' }",
					v-model="item.config.event.scene[dataDefault.activeIndex].id",
					filterable,
					placeholder="目标场景")
					i-option(:value="0") 主场景
					i-option(:value="key", v-for="(item, key) in scene.obj", :key="key") {{ item.name }}
				i-select(
					clearable,
					filterable,
					placeholder="场景过度动画",
					v-model="item.config.event.scene[dataDefault.activeIndex].animate")
					i-option(:value="k", v-for="(k, i) in animates", :key="i") {{ k }}
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import dCode from '../components/d-code/index.vue'
import { animates } from './config.js'

@Component({ components: { dCode } })
export default class FuncData extends func {
	animates = animates

	handleAddClick() {
		this.item.config.event.scene.push({
			id: '',
			type: '',
			animate: '',
		})
	}
	handleRemoveClick(index) {
		this.item.config.event.scene.splice(index, 1)
	}
}
</script>
