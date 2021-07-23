<template lang="pug">
.main
	.child.fn-flex.flex-row(
		@click.stop="editor.selectWidget(child)",
		:class="{ active: editor.currentWidgetId === child.id }")
		.d-left-scene-left
			h2 {{ child.config.widget.name }}
		.d-left-scene-right
	scene-group(:childList="child.children", v-if="child.children")
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {Editor} from '@eslinkv/core'

@Component
export default class widgetGroupItem extends Vue {
	editor: Editor = Editor.Instance()
	@Prop() child
}
</script>
<style lang="scss" scoped>
.main {
	padding-left: 15px;
	background: #282f3a;
}

.child {
	padding: 10px 10px 10px 20px;

	&.active {
		color: var(--white);
		background-color: var(--themeColor);
		border-color: var(--themeColor);
	}

	&:hover {
		border-color: var(--themeColor);
	}

	h2 {
		font-size: 14px;
		font-weight: normal;

		&.group-title {
			color: #ecec43;
		}
	}
}
</style>
