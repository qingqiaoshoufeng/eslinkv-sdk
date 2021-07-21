<template lang="pug">
.fn-flex.flex-row.pos-r
	.d-footer-bar.fn-flex.pointer
		.d-footer-bar-text(@click.stop="viewModal = !viewModal") 视图调整
	ul.d-footer-view-modal.pos-a(v-show="viewModal", v-click-outside="hideView")
		li.fn-flex.pointer(@click="taggerXRoomL1")
			span 组件区
			i-icon.pointer(type="md-checkmark", v-show="editor.xRoomL1 > 0")
		li.fn-flex.pointer(@click="taggerXRoomL2")
			span 场景区
			i-icon.pointer(type="md-checkmark", v-show="editor.xRoomL2 > 0")
		li.fn-flex.pointer(@click="taggerXRoomR1")
			span 设置区
			i-icon.pointer(type="md-checkmark", v-show="editor.xRoomR1 > 0")
	.d-footer-bar.fn-flex.flex-row(@click="copyModal = true")
		.d-footer-bar-text.ellipsis(v-if="editor.sceneObj") {{ editor.currentSceneIndex === 0 ? '主场景' : editor.currentSceneIndex === -1 ? '回收站' : editor.sceneObj[editor.currentSceneIndex].name }}
	.d-footer-bar.fn-flex
		label.d-footer-hot-keys.fn-flex.flex-row
			.d-footer-bar-text.pointer.ellipsis(@click="showHotKey = !showHotKey", v-click-outside="hideHotKey") 快捷键
	ul.d-footer-hot-key-list.pos-a(v-show="showHotKey")
		item-card(v-for="item in hotKeys", :key="item.name", :item="item")
	i-modal(v-model="copyModal", title="场景ID", :footer-hide="true")
		.fn-flex.flex-row
			span.fn-hide.copy-id {{ editor.currentSceneIndex }}
			i-input(:value="editor.currentSceneIndex", search, readonly, enter-button="复制", @on-search="")
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Input, Modal, Icon } from 'view-design'
import Editor from '@/core/Editor'
import { copyText } from '@/vue2/utils'
import ItemCard from '@/vue2/components/d-footer/item-card.vue'
import { hotKeys } from '@/vue2/utils'
import ClickOutside from 'vue-click-outside'

@Component({
	components: {
		'i-input': Input,
		'i-modal': Modal,
		'i-icon': Icon,
		ItemCard,
	},
	directives: { ClickOutside },
})
export default class Left extends Vue {
	showHotKey = false
	copyModal = false
	viewModal = false
	hotKeys = hotKeys
	editor: Editor = Editor.Instance()

	taggerXRoomL1(): void {
		this.editor.taggerXRoomL1()
		this.viewModal = false
	}
	taggerXRoomL2(): void {
		this.editor.taggerXRoomL2()
		this.viewModal = false
	}
	taggerXRoomR1(): void {
		this.editor.taggerXRoomR1()
		this.viewModal = false
	}
	hideHotKey(): void {
		this.showHotKey = false
	}
	hideView(): void {
		this.viewModal = false
	}
	handleCopy(): void {
		copyText(this.editor.currentSceneIndex)
	}
}
</script>
<style lang="scss" scoped>
.d-footer-view-modal {
	bottom: 32px;
	width: 90px;
	color: var(--text-1);
	background: var(--background-4);
	box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.57);
	left: -4px;
	li {
		justify-content: space-between;
		align-items: center;
		padding: 0 16px;
		height: 36px;
		border-bottom: 1px solid #22242b;
		white-space: nowrap;

		&:last-child {
			border-bottom: none;
		}
	}
}
.d-footer-bar {
	padding: 0 10px;
	line-height: 30px;
	cursor: pointer;
	user-select: none;

	&:hover {
		.d-footer-bar-text {
			color: var(--text-3);
		}
	}
}

.d-footer-hot-keys,
.d-footer-info {
	align-items: center;
	justify-content: center;
}

.d-footer-info {
	margin-left: 10px;
}

.d-footer-hot-keys {
	width: 100%;
	height: 100%;
}
.d-footer-hot-key-list {
	bottom: 32px;
	width: 295px;
	pointer-events: none;
	color: var(--text-1);
	background: var(--background-4);
	box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.57);
	left: -4px;
}
</style>
