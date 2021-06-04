<template lang="pug">
li.pointer.pos-r.d-left-scene-list-li(
	:class="[{ active: !editor.chooseWidgetChildId && editor.chooseWidgetId === item.id }]",
	:key="item.id")
	.parent(@click="handleChoose(item)")
		.d-left-scene-left
			h2 {{ item.value.widget.name }}
		.d-left-scene-right
			i-icon(
				v-if="item.value.widget.hide",
				type="md-eye-off",
				title="显示",
				@click="handleTaggerHide(item.id)",
				@click.stop)
			i-icon(
				style="margin-left: 10px",
				v-if="item.value.widget.locked",
				type="md-unlock",
				title="解锁",
				@click="handleUnLock(item.id)",
				@click.stop)
	WidgetGroup(:childList="childList", v-if="editor.chooseWidgetId === item.id")
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Icon } from 'view-design'
import WidgetGroup from './widget-group.vue'
import Editor from '@/core/Editor'

@Component({
	components: {
		'i-icon': Icon,
		WidgetGroup,
	},
})
export default class DLeftSceneItem extends Vue {
	editScene = false
	copyModel = false
	childList = []
	editor = Editor.Instance()
	@Prop() item
	get list(): any {
		const list = []
		for (const key in this.editor.screenWidgets) {
			const item = this.editor.screenWidgets[key]
			if (item.scene === this.editor.sceneIndex) {
				list.push(item)
			}
		}
		return list
	}

	handleUpZIndex(id: string): void {
		this.editor.screenWidgets[id].value.layout.zIndex++
	}

	handleDownZIndex(id: string): void {
		this.editor.screenWidgets[id].value.layout.zIndex--
	}

	handleUnLock(id: string): void {
		this.editor.screenWidgets[id].value.widget.locked = false
	}

	handleFocusSceneName(): void {
		this.editor.unChooseWidget()
	}

	handleChoose(item: any): void {
		this.editor.chooseWidgetId = item.id
		this.editor.chooseWidgetChildId = null
		if (item.children) {
			this.childList = item.children
		}
	}

	handleTaggerHide(id) {
		this.editor.screenWidgets[id].value.widget.hide = !this.editor
			.screenWidgets[id].value.widget.hide
	}
}
</script>
<style lang="scss" scoped>
.d-left-scene-list-li {
	margin: 10px 0;
	font-size: 12px;
	border: 1px solid #393b4a;
	transition: all 0.3s;

	.parent {
		display: flex;
		align-items: center;
		padding: 10px;
	}

	/deep/ {
		.ivu-input {
			font-size: 12px;
		}
	}

	h3,
	p {
		font-size: 12px;
		font-weight: normal;
	}

	h2 {
		font-size: 14px;
		font-weight: normal;
	}

	&.active {
		color: var(--white);
		background-color: var(--themeColor);
		border-color: var(--themeColor);
	}

	&:hover {
		border-color: var(--themeColor);
	}
}

.d-left-scene-left,
.d-left-scene-right {
	align-items: center;
}

.d-left-scene-left {
	width: 150px;

	.ivu-icon {
		margin-right: 4px;
		font-size: 14px;

		&:hover {
			color: var(--themeColor);
		}
	}
}

.d-left-scene-right {
	justify-content: center;
	margin-left: auto;
	font-weight: bold;
}

.child {
	padding: 10px 10px 10px 20px;
	background: #282f3a;

	&.active {
		color: var(--white);
		background-color: var(--themeColor);
		border-color: var(--themeColor);
	}

	&:hover {
		border-color: var(--themeColor);
	}
}
</style>
