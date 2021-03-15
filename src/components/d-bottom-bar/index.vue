<template lang="pug">
	.d-bottom-bar-box.pos-a.fn-flex.flex-row.z-index-9(v-show="platform.ruler.rulerVisible")
		.d-bottom-bar.fn-flex.flex-row
			label {{scene.index===0?'主场景':scene.obj[scene.index].name}}
			label.d-bottom-info.fn-flex.flex-row(v-if="platform.panelConfig.info")
				span {{ platform.panelConfig.size.width}}×{{platform.panelConfig.size.height}}{{ platform.panelConfig.size.unit}}
		.d-bottom-bar.fn-flex.flex-row
			label(v-show="platform.ruler.rulerVisible") {{ zoom }}
			label.d-bottom-hot-keys.pos-r.fn-flex.flex-row
				d-svg.pointer(icon-class="keyboard" title="快捷键")
				.d-bottom-hot-key-list.pos-a
					ul
						li.fn-flex.flex-row(v-for="item in platform.hotKeys" :key="item.name")
							label.d-bottom-name {{ item.name }}
							.d-bottom-key-code.fn-flex.flex-row(v-for="child in item.key")
								i.d-bottom-hot-key-text(v-if="child.type==='text'") {{ child.value }}
								span.d-bottom-hot-key-item(v-if="child.type==='+'") +
								img.d-bottom-hot-key-img(v-if="child.type==='img'" :src="child.value")
</template>
<script lang="ts">
	import { Vue, Component } from 'vue-property-decorator'
	import platform from '../../store/platform.store'
	import scene from '../../store/scene.store'
	import { Icon } from 'view-design'
	import BigNumber from 'bignumber.js'

	BigNumber.set({ DECIMAL_PLACES: 20 })
	@Component({
		components: {
			'i-icon': Icon
		}
	})
	export default class bottomBar extends Vue {
		platform = platform.state
		scene = scene.state

		get zoom () {
			const zoom = new BigNumber(this.platform.ruler.zoom)
			return `${zoom.multipliedBy(100)}%`
		}
	}
</script>
<style lang="scss">
	@import "../../../src/scss/conf";

	.d-bottom-bar-box {
		right: 0;
		bottom: 15px;
		user-select: none;
	}

	.d-bottom-bar {
		align-items: center;
		justify-content: center;
		padding: 4px 10px;
		margin-right: 15px;
		color: $white_08;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 2px;
		opacity: 0.5;
		transition: all 0.3s;

		&:hover {
			opacity: 1;
		}
	}

	.d-bottom-auto-align-guide,
	.d-bottom-hot-keys,
	.d-bottom-info {
		align-items: center;
		justify-content: center;
	}

	.d-bottom-info {
		margin-left: 10px;
	}

	.d-bottom-hot-keys {
		margin-left: 10px;

		.d-bottom-hot-key-list {
			bottom: 100%;
			padding: 10px;
			color: #717171;
			pointer-events: none;
			background: #fff;
			border: 1px solid $borderColor;
			border-radius: 2px;
			opacity: 0;
			transition: all 0.3s;
			transform: translate3d(-50%, -20px, 0);

			li {
				align-items: center;
				padding: 4px 0;
				white-space: nowrap;

				label {
					margin-right: auto;
				}

				.d-bottom-name {
					padding: 3px 10px;
					text-align: right;
					letter-spacing: 0;
				}

				.d-bottom-key-code {
					padding-right: 10px;
				}

				.d-bottom-hot-key-img {
					width: 22px;
					padding: 0 2px;
					text-align: center;
				}

				.d-bottom-hot-key-text {
					min-width: 22px;
					padding: 0 4px;
					font-style: normal;
					text-align: center;
					border: 1px solid #ddd;
					border-radius: 2px;
				}
			}
		}

		&:hover {
			color: $white;

			.d-bottom-hot-key-list {
				opacity: 1;
				transform: translate3d(-50%, -10px, 0);
			}
		}
	}
</style>
