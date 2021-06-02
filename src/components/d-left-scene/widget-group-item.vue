<template lang="pug">
.main
	.child.fn-flex.flex-row(
		@click="handleChoose",
		:class="{ active: screen.chooseWidgetChildId === child.id }")
		.d-left-scene-left
			h2 {{ child.config.widget.name }}
		.d-left-scene-right
	WidgetGroup(:childList="child.children", v-if="child.children")
</template>
<script lang="ts">
import widgetGroup from './widget-group.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component({
	components: { widgetGroup },
})
export default class widgetGroupItem extends Vue {
	childList = []
	screen = this.$screen
	@Prop() child
	handleChoose() {
		this.screen.chooseWidgetChildId = this.child.id
		const target = this.screen.chooseWidget
		this.screen.setChooseWidgetCustomConfig(target.config.customConfig)
	}
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
