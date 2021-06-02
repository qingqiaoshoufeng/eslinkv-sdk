<template lang="pug">
.d-mange-list(v-if="!needChoose || screen.screenWidgets[screen.chooseWidgetId]")
	DManageItem(:config="child", v-for="(child, i) in list", :key="i")
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import DManageItem from './item.vue'

@Component({ components: { DManageItem } })
export default class DManageItemList extends Vue {
	@Prop(Array) list: any[]
	@Prop(Boolean) needChoose: boolean
	screen = { screenWidgets: {} }
}
</script>
