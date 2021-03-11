<template lang="pug">
	d-right-modal.d-manage-modal(title="看板配置" :top="70" icon="ios-easel")
		.d-manage-modal-tab.fn-flex.flex-row
			h2.pointer(v-for="(item,index) in list" :class="tabIndex===index?'active':''" @click="handleChangeTab(index)") {{item.title}}
		template(v-for="(item,index) in list")
			itemList(:list="item.key" v-if="tabIndex===index" :needChoose="item.needChoose")
</template>
<script lang="ts">
	import { Component, Vue, Watch } from 'vue-property-decorator'
	import itemList from './item-list.vue'
	import dRightModal from '../d-right-modal/index.vue'
	import platform from '../../store/platform.store'

	@Component({
		components: {
			itemList, dRightModal
		}
	})
	export default class DRightManage extends Vue {
		tabIndex = 0
		platform = platform.state
		list: any = [
			{
				title: '基础配置', key: [{ type: 'base' }], needChoose: true
			},
			{
				title: '样式配置', key: [{ type: 'style' }], needChoose: true
			},
			{
				title: '数据配置', key: [{ type: 'data' }], needChoose: true
			},
			{
				title: '动画配置', key: [{ type: 'animation' }], needChoose: true
			},
			{
				title: '自定义配置', key: [], needChoose: true
			},
			{
				title: '看板配置', key: [{ type: 'config', needChoose: false }], needChoose: false
			}
		]

		@Watch('platform.chooseWidgetCustomConfig', { deep: true })
		changeChooseWidgetCustomConfig (val) {
			this.list[4].key = val
		}

		handleChangeTab (index) {
			this.tabIndex = index
		}
	}
</script>
<style lang="scss">
	@import "../../../src/scss/conf";

	.d-manage-modal-control-more {
		.d-manage-modal-control {
			flex: 1;
			margin-right: 10px;

			&:last-child {
				margin-right: 0;
			}
		}
	}

	.d-manage-modal-control {
		.ivu-color-picker {
			display: block;
		}

		> label {
			display: block;
			font-size: 14px;
			margin-bottom: 10px;
		}

		.d-manage-modal-control-editor {
			margin-bottom: 10px;
		}

		.ivu-input-number {
			display: block;
			margin-bottom: 10px;
			width: 100%;
		}

		.ivu-switch {
			margin-bottom: 10px;
			margin-top: 5px;
		}

		.ivu-input-wrapper, .ivu-select {
			margin-bottom: 10px;
		}

		.ivu-radio-group-button {
			display: block;
			margin-bottom: 10px;
		}
	}

	.d-manage-modal-tab {

		h2 {
			font-size: 16px;
			height: 40px;
			margin-right: 10px;
			color: rgba(0, 0, 0, .3);
			user-select: none;

			&:hover, &.active {
				color: $themeColor;
			}

			&:last-child {
				margin-right: 0;
			}
		}
	}
</style>
