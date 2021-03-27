<template lang="pug">
  d-right-modal.d-manage-modal(title="看板配置" :width="330" :top="33" icon="ios-easel")
    .d-manage-modal-tab.fn-flex.flex-row(v-if="platform.chooseWidgetState")
      h2.pointer(v-for="(item,index) in list" :class="tabIndex===index?'active':''" @click="handleChangeTab(index)") {{item.title}}
    .d-manage-modal-tab.fn-flex.flex-row(v-else)
      h2.pointer(v-for="(item,index) in chooseList" :class="tabIndex===index?'active':''" @click="handleChangeTab(index)") {{item.title}}
    template(v-if="platform.chooseWidgetState")
      itemList(v-for="(item,index) in list" :list="item.key" v-if="tabIndex===index" :needChoose="item.needChoose")
    template(v-else)
      itemList(v-for="(item,index) in chooseList" :list="item.key" v-if="tabIndex===index" :needChoose="item.needChoose")
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
		chooseList: any = [
			{
				title: '基础', key: [{ type: 'base' }], needChoose: true
			},
			{
				title: '样式', key: [{ type: 'style' }], needChoose: true
			},
			{
				title: '数据', key: [{ type: 'data' }], needChoose: true
			},
			{
				title: '动画', key: [{ type: 'animation' }], needChoose: true
			},
			{
				title: '自定义', key: [], needChoose: true
			}
		]

    list: any = [
      {
        title: '大屏设置', key: [{ type: 'config' }], needChoose: false
      },
      {
        title: '编辑器设置', key: [{ type: 'setting' }], needChoose: false
      }
    ]

    @Watch('platform.chooseWidgetState')
    onChooseWidgetId () {
      this.tabIndex = 0
    }


		@Watch('platform.chooseWidgetCustomConfig', { deep: true })
		changeChooseWidgetCustomConfig (val) {
			this.chooseList[4].key = val
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
			margin-bottom: 10px;
			font-size: 14px;
		}

		.d-manage-modal-control-editor {
			margin-bottom: 10px;
		}

		.ivu-input-number {
			display: block;
			width: 100%;
			margin-bottom: 10px;
		}

		.ivu-switch {
			margin-top: 5px;
			margin-bottom: 10px;
		}

		.ivu-input-wrapper,
		.ivu-select {
			margin-bottom: 10px;
		}

		.ivu-radio-group-button {
			display: block;
			margin-bottom: 10px;
		}
	}

	.d-manage-modal-tab {
		h2 {
			height: 40px;
			margin-right: 10px;
			font-size: 16px;
			color: rgba(0, 0, 0, 0.3);
			user-select: none;

			&:hover,
			&.active {
				color: $themeColor;
			}

			&:last-child {
				margin-right: 0;
			}
		}
	}
</style>
