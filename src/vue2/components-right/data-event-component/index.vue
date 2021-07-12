<template lang="pug">
div
	d-right-swiper-list(
		:title="item.label",
		@add-click="handleAddClick",
		v-for="item in editor.currentWidget.eventType",
		:list="editor.currentWidget.config.event.component",
		@remove-click="handleRemoveClick")
		template(v-slot="dataDefault")
			item-card(:activeIndex="dataDefault.activeIndex")
</template>
<script lang="ts">
import func from '@/vue2/components-func/func.mx'
import { Component } from 'vue-property-decorator'

import ItemCard from './item-card'

@Component({ components: { ItemCard } })
export default class FuncData extends func {
	handleAddClick(): void {
		this.editor.currentWidget.config.event.component.push({
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
	handleRemoveClick(index: number): void {
		this.editor.currentWidget.config.event.component.splice(index, 1)
	}
}
</script>
