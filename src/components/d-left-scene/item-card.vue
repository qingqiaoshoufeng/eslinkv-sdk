<template lang="pug">
li.pointer.pos-r.d-left-scene-list-li(
	:class="[{ active: platform.chooseWidgetId === item.id }]",
	:key="item.id",
	@click="handleChoose(item.id)")
	.fn-flex.flex-row
		.d-left-scene-left
			.fn-flex.flex-column
				.fn-flex-row
					i-icon(
						:type="`md-eye${item.config.widget.hide ? '-off' : ''}`",
						:title="!item.config.widget.hide ? '隐藏' : '显示'",
						@click="handleTaggerHide(item.id)",
						@click.stop)
				h2 {{ item.config.widget.name }}
		.d-left-scene-right.fn-flex.flex-column
			i-icon(
				type="ios-arrow-dropup",
				@click="handleUpZIndex(item.id)",
				@click.stop)
			span {{ item.config.layout.zIndex }}
			i-icon(
				type="ios-arrow-dropdown",
				@click="handleDownZIndex(item.id)",
				@click.stop)
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Icon } from 'view-design'
import scene from '../../store/scene.store'
import platform from '../../store/platform.store'
import ruler from '../../store/ruler.store'

@Component({
	components: {
		'i-icon': Icon,
	},
})
export default class DLeftScene extends Vue {
	scene: any = scene.state
	ruler: any = ruler.state
	platform: any = platform.state
	editScene = false
	copyModel = false
	@Prop() item
	get list() {
		const list = []
		for (const key in this.platform.widgetAdded) {
			const item = this.platform.widgetAdded[key]
			if (item.scene === this.scene.index) {
				list.push(item)
			}
		}
		return list
	}

	handleUpZIndex(id) {
		this.platform.widgetAdded[id].config.layout.zIndex++
	}

	handleDownZIndex(id) {
		this.platform.widgetAdded[id].config.layout.zIndex--
	}

	handleFocusSceneName() {
		platform.actions.unChooseWidget()
	}

	handleChoose(id) {
		this.platform.chooseWidgetId = id
	}

	handleTaggerHide(id) {
		this.platform.widgetAdded[id].config.widget.hide = !this.platform
			.widgetAdded[id].config.widget.hide
	}
}
</script>
<style lang="scss" scoped>
.d-left-scene-list-li {
	align-items: center;
	justify-content: center;
	height: 60px;
	padding: 10px;
	margin: 10px 0;
	font-size: 12px;
	border: 1px solid #393b4a;
	transition: all 0.3s;

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
</style>
