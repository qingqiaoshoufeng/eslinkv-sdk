<template lang="pug">
.d-left-scene.pos-a.fn-flex.flex-column(
	:style="{ width: `${ruler.xRoomL2}px`, left: `${ruler.xRoomL1}px` }")
	.d-left-modal-title.text-center
		span 场景区
	header.fn-flex.flex-row
		i-input(
			:value="scene.obj[scene.index].name",
			@on-change="handleSceneName",
			@on-focus="event.inputFocus = true",
			@on-blur="event.inputFocus = false",
			v-if="editScene")
			i-icon(type="md-checkmark", slot="suffix", @click="editScene = false")
		i-select(
			v-model="scene.index",
			v-if="!editScene",
			filterable,
			@on-query-change="handleFocusSceneName")
			i-option(:value="0") 主场景
			i-option(:value="key", v-for="(item, key) in scene.obj", :key="key") {{ item.name }}
			i-option(:value="-1") 回收站
	ul.d-scrollbar.d-left-scene-list
		item-card(v-for="item in list", :key="item.id", :item="item")
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
import { Icon, Input, Select, Option, Modal } from 'view-design'
import scene from '../../store/scene.store'
import platform from '../../store/platform.store'
import ruler from '../../store/ruler.store'
import { copyText } from '../../utils/index'
import ItemCard from './item-card.vue'

@Component({
	components: {
		ItemCard,
		'i-icon': Icon,
		'i-modal': Modal,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
	},
})
export default class DLeftScene extends Vue {
	scene: any = scene.state
	ruler: any = ruler.state
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

	handleFocusSceneName() {
		platform.actions.unChooseWidget()
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

	handleCopy() {
		copyText(this.scene.index)
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
			content: '是否删除当前场景？该场景未删除的组件将自动进入回收站！',
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
.d-left-scene-bottom {
	width: 100%;

	.d-left-scene-bottom-btn {
		flex: 1;
		height: 30px;
		line-height: 30px;
		color: #999;
		cursor: pointer;
		border-top: 1px solid #282f3a;

		&.disabled {
			color: rgb(61, 77, 102);
			cursor: no-drop;
		}
	}
}

.d-left-scene-list {
	flex: 1;
	padding-left: 8px;
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
}
</style>
