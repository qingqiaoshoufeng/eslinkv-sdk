<template lang="pug">
.d-manage-modal-control
	.fn-flex.flex-column(:style="{ width: '100%', paddingRight: '10px' }")
		i-select(:style="{ marginBottom: '10px' }", @on-change="changeEvent", placeholder="事件类型")
			i-option(value="update") 更新组件
			i-option(value="openScene") 打开场景
			i-option(value="closeScene") 关闭场景
			i-option(value="changeScene") 切换场景
		i-select(
			v-model="editor.currentWidget.config.event.component[activeIndex].ids",
			:style="{ marginBottom: '10px' }",
			placeholder="选择组件",
			multiple,
			filterable)
			i-option(:value="k", :key="i", v-for="(k, i) in Object.keys(editor.screenWidgets)") {{ editor.screenWidgets[k].config.widget.name }}
		i-input(
			:style="{ marginBottom: '10px' }",
			v-model="editor.currentWidget.config.event.component[activeIndex].source",
			placeholder="源地址路径",
			@on-focus="event.inputFocus = true",
			@on-blur="event.inputFocus = false")
		i-select(
			:style="{ marginBottom: '10px' }",
			clearable,
			v-model="editor.currentWidget.config.event.component[activeIndex].target",
			placeholder="目标地址路径")
			i-option(value="config.api.params") 更新请求参数
			i-option(value="config.api.data") 更新响应数据
			i-option(value="config.config") 更新自定义数据
		d-code(
			label="更新加工",
			:code="editor.currentWidget.config.event.component[activeIndex].process.methodBody",
			:show="editor.currentWidget.config.event.component[activeIndex].process.enable",
			@update:code="value => (editor.currentWidget.config.event.component[activeIndex].process.methodBody = value)")
			template(slot="right")
				i-switch(v-model="editor.currentWidget.config.event.component[activeIndex].process.enable")
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import func from '@/vue2/components-func/func.mx'
import dCode from '@/vue2/components-right/d-code/index.vue'

@Component({ components: { dCode } })
export default class FuncData extends func {
	@Prop() activeIndex
	get isWidgetEvent(): boolean {
		return this.editor.currentWidget.config.event.component[this.activeIndex].type === 'update'
	}

	changeEvent(value: string): void {
		if (value === 'update') {
			this.editor.currentWidget.config.event.component[this.activeIndex].type = value
		} else {
			this.editor.currentWidget.config.event.scene[this.activeIndex].type = value
		}
	}
}
</script>
