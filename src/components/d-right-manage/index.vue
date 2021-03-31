<template lang="pug">
  .d-right-modal-box.z-index-999
    .d-right-modal-title.pointer.text-center.fn-flex.flex-row
      span.pos-r(v-for="(item,index) in title" @click="handleClick(index)" :key="item" :class="{active:index===choose}") {{item}}
    .d-right-modal.d-scrollbar
      template(v-if="platform.chooseWidgetState")
        itemList(v-for="(item,index) in list" :list="item.key" v-if="choose===index" :needChoose="item.needChoose")
      template(v-else)
        itemList(v-for="(item,index) in chooseList" :list="item.key" v-if="choose===index" :needChoose="item.needChoose")
</template>
<script lang="ts">
	import { Component, Vue, Watch } from 'vue-property-decorator'
	import itemList from './item-list.vue'
	import platform from '../../store/platform.store'

	@Component({
		components: {
			itemList
		}
	})
	export default class DRightManage extends Vue {
    choose = 0
		platform = platform.state
		chooseList: any = [
			{
				 key: [{ type: 'base' }], needChoose: true
			},
			{
				 key: [{ type: 'data' }], needChoose: true
			},
			{
				key: [{ type: 'animation' }], needChoose: true
			},
			{
				 key: [], needChoose: true
			}
		]

    list: any = [
      {
        key: [{ type: 'config' }], needChoose: false
      },
      {
        key: [{ type: 'scene' }], needChoose: false
      },
      {
        key: [{ type: 'setting' }], needChoose: false
      }
    ]

    get title () {
      if (this.platform.chooseWidgetState) {
        return ['大屏', '场景', '编辑器']
      } else {
        if (this.chooseList[3].key.length > 0) {
          return ['基础', '数据', '动画', '自定义']
        } else {
          return ['基础', '数据', '动画']
        }
      }
    }

    @Watch('platform.chooseWidgetState')
    onChooseWidgetId () {
      this.tabIndex = 0
    }


		@Watch('platform.chooseWidgetCustomConfig', { deep: true })
		changeChooseWidgetCustomConfig (val) {
			this.chooseList[4].key = val
		}

    handleClick (index) {
			this.choose = index
		}
	}
</script>
<style lang="scss">
	@import "../../../src/scss/conf";

	.d-right-modal-box {
		width: 350px;
	}

	.d-right-modal-title {
		height: 40px;
		font-size: 14px;
		line-height: 40px;
		color: #d8d8d8;
		background-color: #2d2f38;

		span {
			flex: 1;
			height: 100%;

			&.active {
				&::before {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 2px;
					content: '';
					background-color: $themeColor;
				}

				background-color: #22242b;
			}
		}
	}

	.d-right-modal {
		height: calc(100vh - 60px);
		padding: 10px;
		overflow-y: auto;
		letter-spacing: 0;
		background-color: #22242b;
	}

	.d-manage-modal-control {
		display: flex;
		display: -webkit-flex;
		min-height: 32px;
		margin-bottom: 10px;
    align-items: center;

		.ivu-color-picker-confirm {
			.ivu-btn-default {
				margin-right: 5px;
			}
		}

		.ivu-color-picker-color {
			div {
				border: 1px solid #393b4a;
			}
		}

		.d-manage-modal-control-text {
			line-height: 32px;
			color: #fafafa;
		}

		.d-manage-modal-control-right {
      justify-content: flex-end;
      display: flex;
      display: -webkit-flex;
			width: 210px;
		}
    .ivu-select-not-found{
      padding: 4px 0;
    }
		.ivu-input-number {
			border: none;
			border-radius: 2px;
		}

		.ivu-select-dropdown {
			padding: 0;
			margin: 0;
			background-color: #2d2f38;
			border-radius: 2px;

			li {
				&:hover,
				&.ivu-select-item-focus {
					color: $themeColor;
					background-color: #22242b;
				}
			}
		}

		.ivu-input-number-handler-wrap {
			background-color: #181b24;
		}
    .ivu-select-placeholder{
      color: #fafafa;
    }
		.ivu-input,
		.ivu-select-selection,
		.ivu-input-number-input {
			background-color: #181b24;
			border: 1px solid #393b4a;
			border-radius: 2px;
      color: #fafafa;
			&:focus {
				border: 1px solid $themeColor;
			}
		}

		.ivu-color-picker {
			display: block;
		}

		> label {
			display: block;
			flex: 1;
			font-size: 12px;
			line-height: 32px;
			color: #fafafa;
		}

		.d-manage-modal-control-editor {

		}

		.ivu-input-number {
			display: block;
		}

		.ivu-switch {
		}

		.ivu-input-wrapper,
		.ivu-select {

		}

		.ivu-radio-group-button {
			display: block;
		}
	}
</style>
