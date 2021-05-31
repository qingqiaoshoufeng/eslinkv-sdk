<template lang="pug">
.d-mange-list(
	v-if="!needChoose || platform.widgetAdded[platform.chooseWidgetId]")
	DManageItem(:config="child", v-for="(child, i) in list", :key="i")
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import DManageItem from './item.vue'
import platform from '../../store/platform.store'

@Component({ components: { DManageItem } })
export default class DManageItemList extends Vue {
	platform = platform.state
	@Prop(Array) list: any[]
	@Prop(Boolean) needChoose: boolean
}
</script>
