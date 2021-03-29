<template lang="pug">
  .widgets-panel.pos-a.fn-flex.flex-row(:class="{ fixed: platform.panelFixed }")
    ul.widgets-panel-left
      li.fn-flex.pos-r.pointer(v-for="item in custom.widgets"
        :key="item.componentTypeId"
        @click="leftIndex=item.componentTypeId"
        :title="item.componentTypeName"
        :class="{active:leftIndex===item.componentTypeId}") {{item.componentTypeName[0]}}
    ul.widgets-panel-right(v-if="leftIndex")
      li(v-for="item in custom.widgets[leftIndex].children"
        :class="{active:openList[item.componentTypeId]}")
        i-icon(type="ios-arrow-down"  @click="handleCheckType(item.componentTypeId,item.market)")
        label( @click="handleCheckType(item.componentTypeId,item.market)") {{item.componentTypeName}}
        .widgets-panel-list.fn-flex(v-if="list[item.componentTypeId]&&openList[item.componentTypeId]")
          item-card(
            v-for="widget in list[item.componentTypeId]"
            :market="item.market"
            :componentEnTitle="widget.componentEnTitle"
            :componentConfig="widget.componentConfig"
            :componentVersion="widget.componentVersion"
            :componentId="widget.componentId"
            :componentAvatar="widget.componentAvatar"
            :componentTitle="widget.componentTitle"
          )
    .widgets-panel-empty.fn-flex(v-else) 快来选择你心仪的组件了
</template>
<script>
	import parts from '../d-widget-part/index'
	import { Icon } from 'view-design'
	import custom from '../../store/custom.store'
	import platform from '../../store/platform.store'
	import itemCard from './item-card'

	export default {
		components: {
			parts,
			'i-icon': Icon,
			itemCard
		},
		data () {
			return {
				custom: custom.state,
				platform: platform.state,
				leftIndex: null,
				rightIndex: null,
				list: {},
				openList: {}
			}
		},
		methods: {
			handleCheckType (componentTypeId, market) {
				if (this.openList[componentTypeId]) {
					this.$set(this.openList, componentTypeId, false)
				} else {
					this.$set(this.openList, componentTypeId, true)
				}
				if (!this.list[componentTypeId]) {
					if (market) {
						this.$api.marketComponent.list({
							componentTypeId,
							isCurrentVersion: true,
							status: 'SUCCESS',
							pageNum: 1,
							pageSize: 999
						}).then(res => {
							this.$set(this.list, componentTypeId, res.list)
						})
					} else {
						const list = this.custom.widgets[this.leftIndex].children
						list.forEach(item => {
							if (item.componentTypeId === componentTypeId) {
								this.$set(this.list, componentTypeId, item.children)
							}
						})
					}
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
@import "src/scss/conf";
.widgets-panel-list{
  padding: 5px;
  background: #0a0b0d;
  justify-content: space-between;
  width: 100%;
}
.widgets-panel-empty{
  align-items: center;
  justify-content: center;
  width: 100%;
}
.d-widget-list-img {
	height: 100px;
}

.widgets-panel {
	top: 0;
	left: 0;

	/* todo 修改尺寸 */
	width: 226px;
	height: 100%;
	padding: 0;
	background-color: #191c21;
}

.widgets-panel-left {
	background-color: #22242b;

	li {
		align-items: center;
		justify-content: center;
		width: 46px;
		height: 46px;
    color: rgb(188,201,212);
		&.active {
			background-color: #191c21;
      color: $themeColor;
			&::before {
				position: absolute;
				top: 0;
				left: 0;
				width: 2px;
				height: 100%;
				content: '';
				background-color: $themeColor;
			}
		}
	}
}

.widgets-panel-right {
  width: 100%;
	li{
    width: 100%;
    &.active{
      ::v-deep{
        .ivu-icon{
          transform: rotate(0);
        }
      }
    }
    ::v-deep{
      .ivu-icon{
        color: rgb(188,201,212);
        margin: 0 10px;
        transform: rotate(-90deg);
        transition: all .3s;
      }
    }
	}

	label {
		line-height: 40px;
    color: rgb(188,201,212);
	}
}
</style>
