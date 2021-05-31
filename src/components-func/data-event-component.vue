<template lang="pug">
d-right-swiper-list(
	title="组件事件",
	@add-click="handleAddClick",
	:list="item.config.event.component",
	@remove-click="handleRemoveClick")
	template(v-slot="dataDefault")
		.d-manage-modal-control
			.fn-flex.flex-column(:style="{ width: '100%', paddingRight: '10px' }")
				i-select(
					clearable,
					:style="{ marginBottom: '10px' }",
					v-model="item.config.event.component[dataDefault.activeIndex].type",
					placeholder="事件类型")
					i-option(value="update") 更新组件
				i-select(
					v-model="item.config.event.component[dataDefault.activeIndex].ids",
					:style="{ marginBottom: '10px' }",
					placeholder="选择组件",
					multiple,
					filterable)
					i-option(
						:value="k",
						:key="i",
						v-for="(k, i) in Object.keys(platform.widgetAdded)") {{ platform.widgetAdded[k].config.widget.name }}
				i-input(
					:style="{ marginBottom: '10px' }",
					v-model="item.config.event.component[dataDefault.activeIndex].source",
					placeholder="源地址路径",
					@on-focus="event.inputFocus = true",
					@on-blur="event.inputFocus = false")
				i-select(
					:style="{ marginBottom: '10px' }",
					clearable,
					v-model="item.config.event.component[dataDefault.activeIndex].target",
					placeholder="目标地址路径")
					i-option(value="config.api.params") 更新请求参数
					i-option(value="config.api.data") 更新响应数据
					i-option(value="config.config") 更新自定义数据
				d-code(
					label="更新加工",
					:code="item.config.event.component[dataDefault.activeIndex].process.methodBody",
					:show="item.config.event.component[dataDefault.activeIndex].process.enable",
					@update:code="value => (item.config.event.component[dataDefault.activeIndex].process.methodBody = value)")
					template(slot="right")
						i-switch(
							v-model="item.config.event.component[dataDefault.activeIndex].process.enable")
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import dCode from '../components/d-code/index.vue'

@Component({ components: { dCode } })
export default class FuncData extends func {
	handleAddClick() {
		this.item.config.event.component.push({
			ids: [],
			type: '',
			source: '',
			target: '',
			process: {
				enable: false,
				methodBody: '',
			},
		})
	}
	handleRemoveClick(index) {
		this.item.config.event.component.splice(index, 1)
	}
}
</script>
