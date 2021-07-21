<template lang="pug">
drawer(title="组件升级", :closable="false", v-model="showDrawer")
	.drawer-tool
		checkbox(:indeterminate="indeterminate", :value="checkAll", @click.prevent.native="handleCheckAll") 可更新组件
		.update-btn(@click="update") 更新
	checkbox-group.group(v-model="checkAllGroup", @on-change="checkAllGroupChange")
		.row(v-for="(k, i) in data", :key="i")
			checkbox(:label="k.componentTitle")
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Drawer, Checkbox, CheckboxGroup } from 'view-design'
import Editor from '@/core/Editor'

@Component({
	components: {
		CheckboxGroup,
		Checkbox,
		Drawer,
	},
})
export default class MarketEditDialog extends Vue {
	@Prop(Boolean) value!: boolean
	@Prop(Array) data: any
	showDrawer = false
	checkAllGroup = []
	checkAll = false
	indeterminate = false
	editor: Editor = Editor.Instance()

	@Watch('value')
	onValueChange(val) {
		this.showDrawer = val
	}

	@Watch('showDrawer')
	onModalShow(val) {
		this.$emit('input', val)
	}

	handleCheckAll() {
		if (this.indeterminate) {
			this.checkAll = false
		} else {
			this.checkAll = !this.checkAll
		}
		this.indeterminate = false

		if (this.checkAll) {
			this.checkAllGroup = this.data.map((v: any) => v.componentTitle)
		} else {
			this.checkAllGroup = []
		}
	}
	checkAllGroupChange(data) {
		if (data.length === this.data.length) {
			this.indeterminate = false
			this.checkAll = true
		} else if (data.length > 0) {
			this.indeterminate = true
			this.checkAll = false
		} else {
			this.indeterminate = false
			this.checkAll = false
		}
	}
	update() {
		if (this.checkAllGroup.length === 0) return
		this.$Modal.confirm({
			title: `更新组件`,
			content: '更新组件有可能导致组件不可用，如果有重要数据请备份大屏。是否确定要更新？',
			onOk: () => {
				this.checkAllGroup.forEach((v: any) => {
					const t = this.data.find((m: any) => m.componentTitle === v)
					this.editor.sceneWidgets[this.editor.current.currentSceneIndex][
						t.componentId
					].config.widget.componentVersion = t.componentVersion
					this.showDrawer = false
					this.$Message.success('组件升级成功')
				})
			},
			okText: '确定',
			cancelText: '取消',
		})
	}
}
</script>
<style lang="scss" scoped>
::v-deep {
	.ivu-drawer-content {
		background: #22242b;
		.ivu-drawer-header-inner {
			color: #fff;
		}
	}
	.ivu-checkbox-inner {
		background-color: rgb(24, 27, 36);
		border-color: #393b4a;
		margin-right: 4px;
	}
}
.drawer-tool {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 40px;
	padding: 0 10px;
	background-color: #313237;
	color: #fff;

	.update-btn {
		width: 56px;
		height: 18px;
		background-color: #545454;
		color: #aaa;
		font-size: 12px;
		border-radius: 2px;
		text-align: center;
		line-height: 18px;
		cursor: pointer;
	}
}

.group {
	color: rgb(191, 191, 191);
	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 14px;
		height: 36px;
		border-bottom: 1px solid #393b4a;
	}
}
</style>
