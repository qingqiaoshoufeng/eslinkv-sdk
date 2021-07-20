<template lang="pug">
.d-detail-left.fn-flex
	.d-detail-left-icon-box.fn-flex
		.d-detail-left-icon.fn-flex.pointer
			i-icon(type="ios-arrow-dropleft", size="22")
	.d-detail-title.fn-flex.pointer(:title="editor.name", @click="editName = true")
		d-input(v-model="editor.name", @on-blur="editName = false", :autofocus="true")
		//span.fn-flex.d-detail-title.ellipsis(v-else) {{ editor.name }}
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Icon } from 'view-design'
import Editor from '@/core/Editor'
import dInput from '@/vue2/components/d-input'
@Component({
	components: {
		'i-icon': Icon,
		dInput,
	},
})
export default class DDetail extends Vue {
	editor: Editor = Editor.Instance()
	editName = false
}
</script>
<style lang="scss" scoped>
.d-detail-left-icon-box {
	height: 100%;
	align-items: center;
}
.d-detail-left-icon {
	padding: 0 20px;
	height: 100%;
	align-items: center;
	color: var(--text-tab);
	&:hover {
		background-color: #30333d;
		color: #4fb0ff;
	}
}

.d-detail-title {
	font-size: 15px;
	color: var(--text-tab);
	margin-right: auto;
	align-items: center;
	span {
		width: 152px;
		height: 30px;
		padding: 0 8px;
		align-items: center;
		&:hover {
			background-color: #30333d;
		}
	}
}

.d-detail-left {
	margin-right: auto;
	height: 100%;
}
</style>
