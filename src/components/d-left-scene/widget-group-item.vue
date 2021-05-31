<template lang="pug">
	.main
		.child.fn-flex.flex-row(@click="handleChoose" :class="{active: platform.chooseWidgetChildId === child.id}")
			.d-left-scene-left
				h2 {{ child.config.widget.name }}
			.d-left-scene-right
		WidgetGroup(:childList="child.children" v-if="child.children")
</template>
<script>
import platform from '../../store/platform.store'
import { chooseWidget } from '@/utils'

export default {
	name: 'WidgetGroupItem',
	components: { WidgetGroup: () => import('./widget-group.vue') },
	props: ['child'],
	data() {
		return {
			platform: platform.state,
			childList: [],
		}
	},
	methods: {
		handleChoose() {
			this.platform.chooseWidgetChildId = this.child.id
			const target = chooseWidget()
			platform.actions.setChooseWidgetCustomConfig(
				target.config.customConfig,
			)
		},
	},
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
