<template lang="pug">
li.pointer.pos-r.d-left-scene-list-li(
	:class="[{ active: !screen.chooseWidgetChildId && screen.chooseWidgetId === item.id }]",
	:key="item.id")
	.parent(@click="handleChoose(item)")
		.d-left-scene-left
			h2 {{ item.config.widget.name }}
		.d-left-scene-right
			i-icon(
				v-if="item.config.widget.hide"
				type="md-eye-off",
				title="显示",
				@click="handleTaggerHide(item.id)",
				@click.stop)
			i-icon(
				style="margin-left: 10px;"
				v-if="item.config.widget.locked"
				type="md-unlock",
				title="解锁",
				@click="handleUnLock(item.id)",
				@click.stop)
	WidgetGroup(:childList="childList", v-if="screen.chooseWidgetId === item.id")
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Icon } from 'view-design'
import WidgetGroup from './widget-group.vue'

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
	screen = {}
	@Prop() item
	get list() {
		const list = []
		for (const key in this.screen.screenWidgets) {
			const item = this.screen.screenWidgets[key]
			if (item.scene === this.screen.sceneIndex) {
				list.push(item)
			}
		}
		return list
	}

	handleUpZIndex(id) {
		this.screen.screenWidgets[id].config.layout.zIndex++
	}

	handleDownZIndex(id) {
		this.screen.screenWidgets[id].config.layout.zIndex--
	}

	handleUnLock(id) {
		this.screen.screenWidgets[id].config.widget.locked = false
	}

	handleFocusSceneName() {
		this.screen.unChooseWidget()
	}

	handleChoose(item) {
		this.screen.chooseWidgetId = item.id
		this.screen.chooseWidgetChildId = null
		if (item.children) {
			this.childList = item.children
		}
	}

	handleTaggerHide(id) {
		this.screen.screenWidgets[id].config.widget.hide = !this.screen
			.screenWidgets[id].config.widget.hide
	}
	mounted() {
		this.screen = this.$screen
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
