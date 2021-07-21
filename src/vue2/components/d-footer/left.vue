<template lang="pug">
.fn-flex.flex-row.pos-r
	.d-footer-bar.fn-flex.flex-row(@click="copyModel = true")
		.d-footer-bar-text.ellipsis(v-if="editor.sceneObj") {{ editor.currentSceneIndex === 0 ? '主场景' : editor.currentSceneIndex === -1 ? '回收站' : editor.sceneObj[editor.currentSceneIndex].name }}
	.d-footer-bar.fn-flex
		label.d-footer-hot-keys.fn-flex.flex-row
			.d-footer-bar-text.pointer.ellipsis(@click="showHotKey = !showHotKey", v-click-outside="hideHotKey") 快捷键
	ul.d-footer-hot-key-list.pos-a(v-show="showHotKey")
		item-card(v-for="item in hotKeys", :key="item.name", :item="item")
	i-modal(v-model="copyModel", title="场景ID", :footer-hide="true")
		.fn-flex.flex-row
			span.fn-hide.copy-id {{ editor.currentSceneIndex }}
			i-input(:value="editor.currentSceneIndex", search, readonly, enter-button="复制", @on-search="handleCopy")
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Input, Modal } from 'view-design'
import Editor from '@/core/Editor'
import { copyText } from '@/vue2/utils'
import ItemCard from '@/vue2/components/d-footer/item-card.vue'
import { hotKeys } from '@/vue2/utils'
import ClickOutside from 'vue-click-outside'

@Component({
	components: {
		'i-input': Input,
		'i-modal': Modal,
		ItemCard,
	},
	directives: { ClickOutside },
})
export default class DFooter extends Vue {
	showHotKey = false
	copyModel = false
	hotKeys = hotKeys
	editor: Editor = Editor.Instance()
	hideHotKey() {
		this.showHotKey = false
	}
	handleCopy(): void {
		copyText(this.editor.currentSceneIndex)
	}
}
</script>
<style lang="scss" scoped>
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
