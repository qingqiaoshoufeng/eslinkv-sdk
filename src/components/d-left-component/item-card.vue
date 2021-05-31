<template lang="pug">
.widget-item-wrapper.pos-r
	.fn-flex.flex-column.d-widget-list-card.pointer(
		draggable="true",
		@dragstart="dragstart($event)")
		h2.ellipsis(:title="componentTitle") {{ componentTitle }}
		.d-widget-list-img.fn-flex(
			:style="{ backgroundImage: `url(${componentAvatar})` }")
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class ItemCard extends Vue {
	@Prop() componentEnTitle
	@Prop() componentConfig
	@Prop() componentAvatar
	@Prop() componentId
	@Prop() componentVersion
	@Prop() componentTitle
	@Prop() market: boolean

	/**
	 * @description h5 原生拖拽事件
	 */
	dragstart(e) {
		e.dataTransfer.setData(
			'widget-config',
			JSON.stringify({
				type: this.componentEnTitle,
				config: { layout: this.componentConfig.layout },
				market: this.market,
				componentVersion: this.componentVersion,
				componentId: this.componentId,
				startX: e.offsetX,
				startY: e.offsetY,
			}),
		)
	}
}
</script>
<style lang="scss" scoped>
.d-widget-list-card {
	width: 80px;

	h2 {
		padding: 0 5px;
		font-size: 12px;
		line-height: 22px;
		white-space: nowrap;
		background: #212326;
	}
}

.d-widget-list-img {
	width: 80px;
	height: 58px;
	background-color: #17191c;
	background-repeat: no-repeat;
	background-position: center;
	background-clip: content-box;
	background-size: contain;
}

.widget-item-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 80px;
	margin-bottom: 5px;
	overflow: hidden;
	background: rgba(0, 0, 0, 1);
	transition: 0.3s;

	&:nth-child(2n) {
		margin-right: 0;
	}
}
</style>
