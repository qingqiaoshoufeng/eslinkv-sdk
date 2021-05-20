<template lang="pug">
.d-left-component.pos-a.fn-flex.flex-column(
	:style="{ width: `${ruler.xRoomL1}px` }")
	.d-left-modal-title.text-center
		span 组件区
	.fn-flex.flex-row(:style="{ flex: 1, height: 'calc(100% - 40px)' }")
		ul.d-left-component-left
			li.fn-flex.pos-r.pointer(
				v-for="item in custom.widgets",
				:key="item.componentTypeId",
				@click="leftIndex = item.componentTypeId",
				:title="item.componentTypeName",
				:class="{ active: leftIndex === item.componentTypeId }")
				p.ellipsis {{ item.componentTypeName }}
		ul.d-left-component-right.d-scrollbar(v-if="leftIndex")
			li.pointer(
				v-for="item in custom.widgets[leftIndex].children",
				:class="{ active: openList[item.componentTypeId] }")
				i-icon(
					type="ios-arrow-down",
					@click="handleCheckType(item.componentTypeId, item.market)")
				label.pointer(@click="handleCheckType(item.componentTypeId, item.market)") {{ item.componentTypeName }}
				.d-left-component-list.fn-flex(
					v-if="list[item.componentTypeId] && openList[item.componentTypeId]")
					item-card(
						v-for="widget in list[item.componentTypeId]",
						:market="item.market",
						:componentEnTitle="widget.componentEnTitle",
						:componentConfig="widget.componentConfig",
						:componentVersion="widget.componentVersion",
						:componentId="widget.componentId",
						:componentAvatar="widget.componentAvatar",
						:componentTitle="widget.componentTitle")
		.d-left-component-empty.fn-flex(v-else) 快来选择你心仪的组件了
</template>
<script lang="ts">
import parts from '../d-widget-part/index.vue'
import { Icon } from 'view-design'
import custom from '../../store/custom.store'
import platform from '../../store/platform.store'
import ruler from '../../store/ruler.store'
import itemCard from './item-card.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
	components: {
		parts,
		'i-icon': Icon,
		itemCard,
	},
})
export default class DLeftWidget extends Vue {
	custom = custom.state
	platform = platform.state
	ruler = ruler.state
	leftIndex = null
	rightIndex = null
	list = {}
	openList = {}

	handleCheckType(componentTypeId, market) {
		if (this.openList[componentTypeId]) {
			this.$set(this.openList, componentTypeId, false)
		} else {
			this.$set(this.openList, componentTypeId, true)
		}
		if (!this.list[componentTypeId]) {
			if (market) {
				this.$api.marketComponent
					.typeList({
						componentTypeId,
						isCurrentVersion: true,
						status: 'SUCCESS',
						pageNum: 1,
						pageSize: 999,
					})
					.then(res => {
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
</script>
<style lang="scss" scoped>
.d-left-component-list {
	flex-wrap: wrap;
	justify-content: space-between;
	width: 100%;
	padding: 5px;
	background: #0a0b0d;
}

.d-left-component-empty {
	align-items: center;
	justify-content: center;
	width: 100%;
}

.d-widget-list-img {
	height: 100px;
}

.d-left-component {
	top: 0;
	left: 0;
	height: 100%;
	padding: 0;
	overflow: hidden;
	background-color: #191c21;
	transition: width 0.3s;
}

.d-left-component-left {
	background-color: #22242b;

	li {
		align-items: center;
		justify-content: center;
		width: 46px;
		min-width: 0;
		height: 46px;
		color: rgb(188, 201, 212);

		&.active {
			color: var(--themeColor);
			background-color: #191c21;

			&::before {
				position: absolute;
				top: 0;
				left: 0;
				width: 2px;
				height: 100%;
				content: '';
				background-color: var(--themeColor);
			}
		}
	}

	p {
		user-select: none;
	}
}

.d-left-component-right {
	width: 100%;

	li {
		width: 100%;

		&.active {
			/deep/ {
				.ivu-icon {
					transform: rotate(0);
				}
			}
		}

		/deep/ {
			.ivu-icon {
				margin: 0 10px;
				color: rgb(188, 201, 212);
				transition: all 0.3s;
				transform: rotate(-90deg);
			}
		}
	}

	label {
		line-height: 40px;
		color: rgb(188, 201, 212);
		user-select: none;
	}
}
</style>
