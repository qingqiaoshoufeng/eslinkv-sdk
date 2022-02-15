<template lang="pug">
d-drawer(title="历史记录", v-model="currentVal")
	.drawer-tool.fn-flex.flex-column
		ul
			li.fn-flex.flex-column.align-items--flex-start.cursor-point(v-for="item in screenHistoryRecord", @click="initEditor(item)") 
				p 标题： {{item.screenName}}
				p 保存时间：{{new Date(item.updateTime).toLocaleDateString()}}
				
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import DDrawer from '@/vue2/components-style/d-drawer/index.vue'
import Editor from '@/core/Editor'

@Component({
	components: { DDrawer },
})
export default class Notice extends Vue {
	@Prop() screenHistoryRecord
	@Prop() value
	editor: Editor = Editor.Instance()
	currentVal = false
	@Watch('value')
	valueChange(val): void {
		this.currentVal = val
	}

	@Watch('currentVal')
	onCurrentVal(val: boolean): void {
		this.$emit('input', val)
	}
	initEditor(item: any): void {
		this.editor.clear()
		this.$nextTick(() => {
			this.editor.init(item)
		})
	}
}
</script>
<style lang="scss" scoped>
.empty {
	align-items: center;
	justify-content: center;
	padding: 10px;
	font-size: 12px;
}
.drawer-tool {
	padding: 10px;
	color: #fff;

	.update-btn {
		width: 56px;
		height: 18px;
		font-size: 12px;
		line-height: 18px;
		color: #aaa;
		text-align: center;
		cursor: pointer;
		background-color: #545454;
		border-radius: 2px;
	}
	.left-box {
		margin-right: auto;
	}
	li {
		align-items: center;
		padding: 10px 0;
		p {
			font-size: 12px;
		}
		h2 {
			font-size: 14px;
		}
	}
	.look-btn {
		margin-left: 20px;
	}
	.cursor-point {
		cursor: pointer;
	}
	.align-items--flex-start {
		align-items: flex-start;
		color: #ffffff;
		padding-left: 12px;
		&:hover {
			background-color: #aeaeae;
		}
	}
}
</style>
