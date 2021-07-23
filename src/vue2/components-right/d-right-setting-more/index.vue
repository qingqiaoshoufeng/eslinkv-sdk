<template lang="pug">
.d-right-modal-box.z-index-999(:style="{ width: `${editor.xRoomR1}px` }")
	.d-right-modal-more-list.fn-flex.flex-column
		i-button(@click="handleGroup", type="primary") 组合
		i-button(@click="handleDelete", type="primary") 删除
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Button } from 'view-design'
import {Editor} from '@eslinkv/core'

@Component({
	components: {
		'i-button': Button,
	},
})
export default class DRightSettingMore extends Vue {
	editor: Editor = Editor.Instance()

	handleGroup(): void {
		this.editor.createWidgetGroup()
	}
	handleDelete(): void {
		this.$Modal.confirm({
			title: '是否删除所选组件？',
			content: '所有组件将自动进入回收站！',
			onOk: () => {
				this.editor.deleteWidgets()
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
