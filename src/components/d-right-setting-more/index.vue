<template lang="pug">
.d-right-modal-box.z-index-999(:style="{ width: `${ruler.xRoomR1}px` }")
	.d-right-modal-more-list.fn-flex.flex-column
		i-button(@click="handleGroup", type="primary") 成组
		i-button(@click="handleDelete", type="primary") 删除
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Button } from 'view-design'
import { uuid, configMerge } from '@/utils/index.js'
import commonConfigValue from '../../../common-config-value.js'

@Component({
	components: {
		'i-button': Button,
	},
})
export default class DRightSettingMore extends Vue {
	ruler = {}
	screen = {}

	handleGroup() {
		const children = []
		this.screen.chooseWidgetArray.map(item => {
			children.push(this.screen.screenWidgets[item])
			this.$delete(this.screen.screenWidgets, item)
		})
		const id = uuid()
		const config = configMerge(
			{
				widget: { id, name: '分组' },
				layout: {
					size: {
						width: this.screen.chooseWidgetArrayConfig.width,
						height: this.screen.chooseWidgetArrayConfig.height,
					},
					position: {
						left: this.screen.chooseWidgetArrayConfig.left,
						top: this.screen.chooseWidgetArrayConfig.top,
					},
				},
			},
			commonConfigValue(),
		)
		this.$set(this.screen.screenWidgets, id, {
			config,
			id,
			market: false,
			scene: this.screen.sceneIndex,
			type: 'group',
			children,
		})
		this.screen.chooseWidgetId = id
		this.screen.chooseWidgetArray = []
	}
	handleDelete() {
		this.$Modal.confirm({
			title: '提示',
			content: '是否删除所选组件？',
			onOk: () => {
				this.screen.chooseWidgetArray.map(item => {
					this.$delete(this.screen.screenWidgets, item)
				})
				this.screen.chooseWidgetArray = []
			},
		})
	}
	mounted() {
		this.ruler = this.$ruler
		this.screen = this.$screen
	}
}
</script>
<style lang="scss" scoped>
.d-right-modal-more-list {
	align-items: center;
	justify-content: center;
	margin: 20px;

	/deep/ .ivu-btn {
		margin-bottom: 10px;
	}
}
</style>
