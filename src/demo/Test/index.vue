<template lang="pug">
div 
	load-mask
</template>
<script lang="ts">
import Editor from '@/core/Editor'
import { Vue, Component } from 'vue-property-decorator'
import LoadMask from '@/vue2/components/load-mask'

@Component({
	components: { LoadMask },
})
export default class extends Vue {
	editor: Editor = Editor.Instance()
	clickPost(): void {
		this.editor.request('post', '/node/market/component/list', { p: 1 })
	}

	clickGet(): void {
		this.editor.request('get', '/node/market/component/list', { p: 1 })
	}
}
</script>
