<template lang="pug">
img(:src="src", v-bind="{ ...$props, ...$attrs }", v-on="$listeners")
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Editor from '@/core/Editor'

@Component
export default class DImage extends Vue {
	@Prop(String) path: string

	editor: Editor = Editor.Instance()
	src = ''

	async created() {
		this.src = await this.editor.imageCache.get(this.path)
	}
}
</script>
