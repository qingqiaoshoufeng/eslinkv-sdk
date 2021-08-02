<template lang="pug">
	drawer(title="全局请求设置", :closable="false", v-model="isShow" :width="300")
		i-form
			i-form-item(label="domain")
				d-input(v-model="editor.screen.screenDomain")
			i-form-item(label="headers")
				editor.d-manage-modal-control-editor(
					v-model="editor.screen.screenHeaders",
					@init="editorInit",
					lang="javascript",
					theme="idle_fingers",
					height="200")
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import {Drawer, FormItem, Form} from 'view-design'
import dInput from '@/vue2/components/d-input/index.vue'
import Editor from '@/core/Editor'
const editor = require('vue2-ace-editor')

@Component({
	components: {
		editor,
		dInput,
		Drawer,
		'i-form': Form,
		'i-form-item': FormItem,
	},
})
export default class MarketEditDialog extends Vue {
	@Prop(Boolean) value!: boolean
	@Prop(Array) data: any
	isShow = false
	editor: Editor = Editor.Instance()

	@Watch('value')
	onValueChange(val) {
		this.isShow = val
	}

	@Watch('isShow')
	onModalShow(val) {
		this.$emit('input', val)
	}
	
	editorInit() {
		require('brace/ext/language_tools')
		require('brace/mode/html')
		require('brace/mode/javascript')
		require('brace/mode/less')
		require('brace/mode/json')
		require('brace/theme/idle_fingers')
		require('brace/snippets/javascript')
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
		margin-right: 4px;
		background-color: rgb(24, 27, 36);
		border-color: #393b4a;
	}

	.ace_scrollbar-v {
		&::-webkit-scrollbar {
			width: 4px;
			height: 1px;
			transition: all 0.3s;
		}

		&::-webkit-scrollbar-thumb {
			background: rgba(83, 83, 83, 1);
			border-radius: 10px;
			transition: all 0.3s;
		}

		&::-webkit-scrollbar-track {
			background: rgba(237, 237, 237, 1);
			border-radius: 10px;
			transition: all 0.3s;
		}
	}

	.ace-idle-fingers {
		background-color: rgb(24, 27, 36) !important;
		border: 1px solid #393b4a;

		.ace_gutter {
			background-color: rgb(24, 27, 36) !important;
			border-right: 1px solid #393b4a;
		}

		.ace_gutter-active-line {
			background-color: rgb(24, 27, 36) !important;
		}

		.ace_cursor {
			color: #999 !important;
		}

		.ace_marker-layer {
			.ace_active-line {
				background-color: rgb(24, 27, 36) !important;
			}
		}

		.ace_string {
			color: var(--themeColor) !important;
		}

		.ace_variable {
			color: #a2adce;
		}

		.ace_numeric {
			color: #4cbd66 !important;
		}
	}
}
</style>
