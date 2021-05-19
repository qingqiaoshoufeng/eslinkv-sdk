<template lang="pug">
.d-right-modal-box.z-index-999(:style="{ width: `${ruler.xRoomR1}px` }")
	.d-right-modal-name.fn-flex.flex-row
		span(contenteditable="editName", @input="changeName") {{ staticName }}_{{ platform.chooseWidgetId ? platform.widgetAdded[platform.chooseWidgetId].id : '' }}
		i-icon.pointer(
			type="md-checkmark",
			slot="suffix",
			@click="editName = false",
			v-if="editName")
		i-icon.pointer(
			type="ios-create-outline",
			@click="editName = true",
			v-if="!editName")
		i-icon.pointer(
			:type="platform.widgetAdded[platform.chooseWidgetId].config.widget.locked ? 'md-lock' : 'md-unlock'",
			@click="handleLock",
			v-if="!editName")
	.d-right-modal-id.fn-flex.flex-column(v-if="platform.chooseWidgetId")
		span {{ platform.widgetAdded[platform.chooseWidgetId].config.widget.componentVersion }} | {{ platform.widgetAdded[platform.chooseWidgetId].config.widget.name }}
	.d-right-modal-title.pointer.text-center.fn-flex.flex-row
		span.pos-r(
			v-for="(item, index) in title",
			@click="handleClick(index)",
			:key="item",
			:class="{ active: index === tabIndex }") {{ item }}
	.d-right-modal.d-scrollbar-none
		itemList(
			v-for="(item, index) in chooseList",
			:list="item.key",
			v-if="tabIndex === index",
			:needChoose="item.needChoose")
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import itemList from './item-list.vue'
import platform from '../../store/platform.store'
import ruler from '../../store/ruler.store'
import { Icon } from 'view-design'
@Component({
	components: {
		itemList,
		'i-icon': Icon,
	},
})
export default class DRightSetting extends Vue {
	tabIndex = 0
	editName = false
	platform = platform.state
	ruler = ruler.state
	staticName = ''
	title = ['基础', '交互', '主题', '自定义']
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

	@Watch('platform.chooseWidgetId', { deep: true })
	onChooseWidgetId() {
		this.staticName = this.platform.chooseWidgetId
			? this.platform.widgetAdded[this.platform.chooseWidgetId].config
					.widget.name
			: ''
	}

	mounted() {
		this.staticName = this.platform.chooseWidgetId
			? this.platform.widgetAdded[this.platform.chooseWidgetId].config
					.widget.name
			: ''
	}

	@Watch('platform.chooseWidgetCustomConfig', { deep: true, immediate: true })
	changeChooseWidgetCustomConfig(val) {
		this.chooseList[3].key = val
	}

	changeName(e) {
		this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.widget.name = e.target.innerText
	}

	handleLock() {
		this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.widget.locked = !this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.widget.locked
	}

	handleClick(index) {
		this.tabIndex = index
	}
}
</script>
<style lang="scss" scoped>
.d-right-modal {
	height: calc(100vh - 191px);
}
</style>
