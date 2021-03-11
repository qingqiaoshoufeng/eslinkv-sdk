<template lang="pug">
	.d-manage-modal-control
		i-collapse(simple)
			i-panel {{config.label}}
				div(slot="content")
					DManageItem(:config="k" v-for="(k, i) in config.props" :key="i")
</template>
<script lang="ts">
	import func from './func.mx'
	import {Component} from 'vue-property-decorator'
	import DManageItem from '../components/d-right-manage/item.vue'

	@Component({components: {DManageItem}})
	export default class FuncCollapse extends func {

	}
</script>
