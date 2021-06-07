<template lang="pug">
.d-right-modal-box.z-index-999(:style="{ width: `${editor.xRoomR1}px` }")
	.d-right-modal-more-list.fn-flex.flex-column
		i-button(@click="handleGroup", type="primary") 成组
		i-button(@click="handleDelete", type="primary") 删除
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Button } from 'view-design'
import { uuid, configMerge } from '@/utils/index.js'
import commonConfigValue from '../../../common-config-value.js'
import Editor from '@/core/Editor'

@Component({
	components: {
		'i-button': Button,
	},
})
export default class DRightSettingMore extends Vue {
	editor: Editor = Editor.Instance()

	handleGroup() {
		const children = []
		this.editor.currentWidgetList.map(item => {
			children.push(this.editor.screenWidgets[item.id])
			this.$delete(this.editor.screenWidgets, item.id)
		})
		const id = uuid()
		const config = configMerge(
			{
				widget: { id, name: '分组' },
				layout: {
					size: {
						width: this.editor.chooseWidgetArrayConfig.width,
						height: this.editor.chooseWidgetArrayConfig.height,
					},
					position: {
						left: this.editor.chooseWidgetArrayConfig.left,
						top: this.editor.chooseWidgetArrayConfig.top,
					},
				},
			},
			commonConfigValue(),
		)
		this.$set(this.editor.screenWidgets, id, {
			config,
			id,
			market: false,
			scene: this.editor.currentSceneIndex,
			type: 'group',
			children,
		})
		this.editor.unSelectWidget()
	}
	handleDelete() {
		this.$Modal.confirm({
			title: '提示',
			content: '是否删除所选组件？',
			onOk: () => {
				this.editor.currentWidgetList.map(item => {
					this.$delete(this.editor.screenWidgets, item.id)
				})
				this.editor.unSelectWidget()
			},
		})
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
