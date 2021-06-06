<template lang="pug">
.pos-a.widget-part-group(:style="styles")
	.pos-a(:style="stylesR")
		template(v-for="item in children")
			eslinkv-group(v-bind="item", v-if="item.type === 'group'")
			part(
				:ref="item.id",
				:type="item.type",
				:config="item.config",
				:children="item.children",
				:market="item.market",
				v-else)
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import part from '@/components/d-widget-part/index.vue'
@Component({
	components: {
		part,
	},
})
export default class DWidgetPartGroup extends Vue {
	@Prop() config
	@Prop() children
	get styles() {
		const { layout } = this.config
		return {
			width: `${layout.size.width}px`,
			height: `${layout.size.height}px`,
			zIndex: `${layout.zIndex}`,
			transform: `translate3d(${layout.position.left}px, ${
				layout.position.top
			}px,0) ${layout.scale ? 'scale(' + layout.scale + ')' : ''}`,
		}
	}

	get stylesR() {
		const { layout } = this.config
		return {
			left: `-${layout.position.left}px`,
			top: `-${layout.position.top}px`,
		}
	}
}
</script>
<style lang="scss"></style>
