<template lang="pug">
.d-right-modal-box.z-index-999(
	:style="{ width: `${editor.xRoomR1}px` }",
	v-if="screen.chooseWidgetId")
	.d-right-modal-name.fn-flex.flex-row(v-click-outside="close")
		span.widget-name-text(v-if="!editName") {{ screen.chooseWidget.config.widget.name }}_{{ screen.chooseWidget ? screen.chooseWidget.id : '' }}
		i-input.widget-name(
			v-if="editName",
			v-model="screen.chooseWidget.config.widget.name")
		i-icon.pointer.widget-name-icon(
			type="ios-create-outline",
			@click.stop="editName = true",
			v-if="!editName")
		i-icon.pointer.widget-name-icon(
			:type="screen.screenWidgets[screen.chooseWidgetId].config.widget.locked ? 'md-lock' : 'md-unlock'",
			@click.stop="handleLock",
			v-if="!editName")
	.d-right-modal-id.fn-flex.flex-column
		span {{ screen.screenWidgets[screen.chooseWidgetId].config.widget.componentVersion }} | {{ screen.screenWidgets[screen.chooseWidgetId].config.widget.name }}
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
import { Icon, Input } from 'view-design'
import ClickOutside from 'vue-click-outside'
import Editor from '@/core/Editor'

@Component({
	components: {
		itemList,
		'i-icon': Icon,
		'i-input': Input,
	},
	directives: { ClickOutside },
})
export default class DRightSetting extends Vue {
	tabIndex = 0
	editName = false
	editor = Editor.Instance()
	screen = this.$screen
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

	@Watch('screen.chooseWidgetCustomConfig', { deep: true, immediate: true })
	changeChooseWidgetCustomConfig(val) {
		this.chooseList[3].key = val
	}

	close() {
		this.editName = false
	}

	handleLock() {
		this.screen.chooseWidget.config.widget.locked = !this.screen
			.chooseWidget.config.widget.locked
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

.widget-name-icon {
	line-height: 32px;
}

.d-right-modal-name {
	line-height: 32px;
}

.widget-name {
	&::v-deep {
		.ivu-input {
			padding: 0;
			font-size: 20px;
			line-height: 20px;
			color: #fff;
			background-color: transparent;
			border: none;
			border-bottom: 1px solid var(--borderGray);
			border-radius: 0;
			outline: none;
			box-shadow: none;
		}
	}
}
</style>
