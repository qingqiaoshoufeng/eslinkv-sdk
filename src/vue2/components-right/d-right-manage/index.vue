<template lang="pug">
.d-right-modal-box.z-index-999.fn-flex.flex-column(:style="{ width: `${editor.xRoomR1}px`, height: '100%', flex: 1 }")
	.d-right-modal-title 页面设置
	config
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import config from './config.vue'
import { Icon, Input } from 'view-design'
import ClickOutside from 'vue-click-outside'
import Editor from '@/core/Editor'

@Component({
	components: {
		config,
		'i-icon': Icon,
		'i-input': Input,
	},
	directives: { ClickOutside },
})
export default class DRightManage extends Vue {
	editName = false
	editor: Editor = Editor.Instance()
	close(): void {
		this.editName = false
	}
}
</script>
<style lang="scss" scoped>
.d-right-modal-title {
	height: 40px;
	font-size: 14px;
	font-weight: normal;
	line-height: 40px;
	color: #d8d8d8;
	text-align: center;
	background: var(--background-4);
	border-bottom: 1px solid rgba(36, 38, 46, 0.4);
}
</style>
