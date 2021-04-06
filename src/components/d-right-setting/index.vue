<template lang="pug">
div(v-if="platform.chooseWidgetState")
.d-right-modal-box.z-index-999(
	:style="{ width: `${platform.ruler.xRoomR1}px` }",
	v-else)
	.d-right-modal-name.fn-flex.flex-row
		span(contenteditable="editName", @input="changeName") {{ platform.chooseWidgetId ? platform.widgetAdded[platform.chooseWidgetId].config.widget.name : '' }}
		i-icon(
			type="md-checkmark",
			slot="suffix",
			@click="editName = false",
			v-if="editName")
		i-icon(type="ios-create-outline", @click="editName = true", v-if="!editName")
		i-icon(type="md-eye", @click="handleHide", v-if="!editName")
		i-icon(type="md-lock", @click="handleLock", v-if="!editName")
	.d-right-modal-id
		span ID: {{ platform.chooseWidgetId ? platform.widgetAdded[platform.chooseWidgetId].id : '' }}
	.d-right-modal-type
		span 类型: {{ platform.chooseWidgetId ? platform.widgetAdded[platform.chooseWidgetId].type : '' }}
	.d-right-modal-title.pointer.text-center.fn-flex.flex-row
		span.pos-r(
			v-for="(item, index) in title",
			@click="handleClick(index)",
			:key="item",
			:class="{ active: index === choose }") {{ item }}
	.d-right-modal.d-scrollbar
		template(v-if="platform.chooseWidgetState")
			itemList(
				v-for="(item, index) in list",
				:list="item.key",
				v-if="choose === index",
				:needChoose="item.needChoose")
		template(v-else)
			itemList(
				v-for="(item, index) in chooseList",
				:list="item.key",
				v-if="choose === index",
				:needChoose="item.needChoose")
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import itemList from './item-list.vue'
import platform from '../../store/platform.store'
import { Icon, Input } from 'view-design'
@Component({
	components: {
		itemList,
		'i-icon': Icon,
		'i-input': Input,
	},
})
export default class DRightSetting extends Vue {
	choose = 0
	editName: boolean = false
	platform = platform.state
	chooseList: any = [
		{
			key: [{ type: 'base' }],
			needChoose: true,
		},
		{
			key: [{ type: 'data' }],
			needChoose: true,
		},
		{
			key: [{ type: 'theme' }],
			needChoose: true,
		},
		{
			key: [],
			needChoose: true,
		},
	]

	list: any = [
		{
			key: [{ type: 'config' }],
			needChoose: false,
		},
	]

	get title() {
		if (this.platform.chooseWidgetState) {
			return ['大屏']
		} else {
			if (this.chooseList[3].key.length > 0) {
				return ['基础', '数据', '主题', '自定义']
			} else {
				return ['基础', '数据', '主题']
			}
		}
	}

	@Watch('platform.chooseWidgetState')
	onChooseWidgetId() {
		this.tabIndex = 0
	}

	@Watch('platform.chooseWidgetCustomConfig', { deep: true })
	changeChooseWidgetCustomConfig(val) {
		this.chooseList[3].key = val
	}

	changeName(e) {
		this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.widget.name = e.target.innerText
	}

	handleHide() {
		this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.widget.hide = !this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.widget.hide
	}

	handleLock() {
		this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.widget.locked = !this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.widget.locked
	}

	handleClick(index) {
		this.choose = index
	}
}
</script>
