<template lang="pug">
div 
	i-select(v-model="a")
		i-option(:value="1") 1
		i-option(:value="2") 2
</template>
<script lang="ts">
import Editor from '@/core/Editor'
import { Vue, Component } from 'vue-property-decorator'
import { Select, Option } from 'view-design'

@Component({
	components: { 'i-select': Select, 'i-option': Option },
})
export default class extends Vue {
	a = 1
	editor: Editor = Editor.Instance()
	clickPost(): void {
		this.editor.request('post', '/node/market/component/list', { p: 1 })
	}

	clickGet(): void {
		this.editor.request('get', '/node/market/component/list', { p: 1 })
	}
}
</script>
