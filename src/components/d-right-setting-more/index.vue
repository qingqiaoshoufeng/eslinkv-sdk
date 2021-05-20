<template lang="pug">
.d-right-modal-box.z-index-999(:style="{ width: `${ruler.xRoomR1}px` }")
	.d-right-modal-more-list.fn-flex.flex-column
		i-button(@click="handleGroup", type="primary") 成组
		i-button(@click="handleDelete", type="primary") 删除
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Button } from 'view-design'
import ruler from '@/store/ruler.store.js'
import platform from '@/store/platform.store.js'
import scene from '@/store/scene.store.js'
import { uuid, configMerge } from '@/utils/index.js'
import commonConfigValue from '../../../common-config-value.js'

@Component({
	components: {
		'i-button': Button,
	},
})
export default class DRightSettingMore extends Vue {
	ruler = ruler.state
	platform = platform.state
	scene = scene.state

	handleGroup() {
		const children = []
		this.platform.chooseWidgetArray.map(item => {
			children.push(this.platform.widgetAdded[item])
			this.$delete(this.platform.widgetAdded, item)
		})
		const id = uuid()
		const config = configMerge(
			{
				widget: { id, name: '分组' },
				layout: {
					size: {
						width: this.platform.chooseWidgetArrayConfig.width,
						height: this.platform.chooseWidgetArrayConfig.height,
					},
					position: {
						left: this.platform.chooseWidgetArrayConfig.left,
						top: this.platform.chooseWidgetArrayConfig.top,
					},
				},
			},
			commonConfigValue(),
		)
		this.$set(this.platform.widgetAdded, id, {
			config,
			id,
			market: false,
			scene: this.scene.index,
			type: 'group',
			children,
		})
		this.platform.chooseWidgetId = id
		this.platform.chooseWidgetArray = []
	}
	handleDelete() {
		this.$Modal.confirm({
			title: '提示',
			content: '是否删除所选组件？',
			onOk: () => {
				this.platform.chooseWidgetArray.map(item => {
					this.$delete(this.platform.widgetAdded, item)
				})
				this.platform.chooseWidgetArray = []
			},
		})
	}
}
</script>
<style lang="scss" scoped>
.d-right-modal-more-list {
	margin: 20px;
	align-items: center;
	justify-content: center;
	/deep/ .ivu-btn {
		margin-bottom: 10px;
	}
}
</style>
