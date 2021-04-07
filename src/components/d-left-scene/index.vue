<template lang="pug">
.d-left-scene.pos-a.fn-flex.flex-column(
	:style="{ width: `${platform.ruler.xRoomL2}px`, left: `${platform.ruler.xRoomL1}px` }")
	.d-left-modal-title.text-center
		span 场景
	header.fn-flex.flex-row
		i-input(
			:value="scene.obj[scene.index].name",
			@on-change="handleSceneName",
			v-if="editScene")
			i-icon(type="md-checkmark", slot="suffix", @click="editScene = false")
		i-select(v-model="scene.index", v-if="!editScene")
			i-option(:value="0") 主场景
			i-option(:value="key", v-for="(item, key) in scene.obj", :key="key") {{ item.name }}
			i-option(:value="-1") 场景回收站
	ul.d-scrollbar.d-left-scene-list
		li.pointer.pos-r(
			v-for="item in list",
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
							i-icon(
								:type="`md-${item.config.widget.locked ? '' : 'un'}lock`",
								:title="!item.config.widget.locked ? '锁定' : '解锁'",
								@click="handleTaggerLock(item.id)",
								@click.stop)
							i-icon(
								type="md-trash",
								title="删除",
								@click="handleDelete(item.id)",
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
	.d-left-scene-bottom.fn-flex.flex-row
		.d-left-scene-bottom-btn.text-center(@click="handleSetScene('copy')") 复制
		.d-left-scene-bottom-btn.text-center(@click="handleSetScene('create')") 新增
		.d-left-scene-bottom-btn.text-center(
			@click="handleSetScene('edit')",
			:class="{ disabled: scene.index === 0 }") 编辑
		.d-left-scene-bottom-btn.text-center(
			@click="handleSetScene('destroy')",
			:class="{ disabled: scene.index === 0 }") 删除
	i-modal(v-model="copyModel", title="提示", :footer-hide="true")
		.fn-flex.flex-row
			span.fn-hide.copy-id {{ scene.index }}
			i-input(
				v-model="scene.index",
				search,
				readonly,
				enter-button="复制",
				@on-search="handleCopy")
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
	Icon,
	Input,
	Select,
	Option,
	DropdownMenu,
	DropdownItem,
	Dropdown,
	Modal,
	Button,
} from 'view-design'
import scene from '../../store/scene.store'
import platform from '../../store/platform.store'
import { copyText } from '../../utils/index'

@Component({
	components: {
		'i-icon': Icon,
		'i-modal': Modal,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-button': Button,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
		'i-dropdown': Dropdown,
	},
})
export default class DLeftScene extends Vue {
	scene: any = scene.state
	platform: any = platform.state
	editScene = false
	copyModel = false

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

	handleSetScene(name) {
		switch (name) {
			case 'create':
				this.createScene()
				break
			case 'edit':
				if (this.scene.index === 0) {
					return false
				}
				this.editScene = true
				break
			case 'destroy':
				if (this.scene.index === 0) {
					return false
				}
				this.destroyScene()
				break
			case 'copy':
				this.copyModel = true
				break
		}
	}

	handleChoose(id) {
		this.platform.chooseWidgetId = id
	}

	handleCopy() {
		copyText(this.scene.index)
	}

	handleDelete(id) {
		this.$Modal.confirm({
			title: '提示',
			content: '是否删除当前组件？',
			onOk: () => {
				this.$delete(this.platform.widgetAdded, id)
				this.platform.chooseWidgetId = null
			},
		})
	}

	handleTaggerHide(id) {
		this.platform.widgetAdded[id].config.widget.hide = !this.platform
			.widgetAdded[id].config.widget.hide
	}

	handleTaggerLock(id) {
		this.platform.widgetAdded[id].config.widget.locked = !this.platform
			.widgetAdded[id].config.widget.locked
	}

	createScene() {
		scene.actions.createScene()
	}

	handleSceneName(e) {
		scene.actions.setSceneName(this.scene.index, e.target.value)
	}

	destroyScene() {
		this.$Modal.confirm({
			title: '提示',
			content:
				'是否删除当前场景？该场景未删除的组件将自动进入场景回收站！',
			onOk: () => {
				const index = this.scene.index
				scene.actions.setSceneIndex(0)
				scene.actions.deleteScene(index)
				for (const key in this.platform.widgetAdded) {
					const item = this.platform.widgetAdded[key]
					if (item.scene === index) {
						item.scene = -1
					}
				}
			},
		})
	}
}
</script>
<style lang="scss" scoped>
@import '../../scss/conf';
.d-left-scene-bottom {
	width: 100%;
	.d-left-scene-bottom-btn {
		height: 30px;
		line-height: 30px;
		border-top: 1px solid #282f3a;
		flex: 1;
		color: #999;
		cursor: pointer;
		&.disabled {
			cursor: no-drop;
			color: rgb(61, 77, 102);
		}
	}
}
.d-left-scene-list {
	padding-left: 8px;
	flex: 1;

	li {
		align-items: center;
		justify-content: center;
		height: 60px;
		padding: 10px;
		margin: 10px 0;
		font-size: 12px;
		border: 1px solid #393b4a;
		transition: all 0.3s;

		&::v-deep {
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
			color: #fff;
			background-color: $themeColor;
			border-color: $themeColor;
		}

		&:hover {
			border-color: $themeColor;
		}
	}
}

.d-left-scene {
	height: 100%;
	overflow: hidden;
	background-color: #1d2127;
	border-left: 1px solid #000;
	transition: all 0.3s;
	ul {
		overflow-y: auto;
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
				color: $themeColor;
			}
		}
	}

	.d-left-scene-right {
		justify-content: center;
		margin-left: auto;
		font-weight: bold;
	}
}
</style>
