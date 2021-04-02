<template lang="pug">
.d-footer.fn-flex.flex-row.pos-r.z-index-999
	.d-footer-bar.fn-flex.flex-row
		label {{ scene.index === 0 ? '主场景' : scene.obj[scene.index].name }}
		label.d-footer-info.fn-flex.flex-row(v-if="platform.panelConfig.info")
			span {{ platform.panelConfig.size.width }}×{{ platform.panelConfig.size.height }}{{ platform.panelConfig.size.unit }}
	.d-footer-bar.fn-flex
		label.d-footer-hot-keys.pos-r.fn-flex.flex-row
			span.pointer(@click="showHotKey = !showHotKey") 快捷键
			.d-footer-hot-key-list.pos-a(:class="{ active: showHotKey }")
				ul
					li.fn-flex.flex-row(v-for="item in platform.hotKeys", :key="item.name")
						label.d-footer-name {{ item.name }}
						.d-footer-key-code.fn-flex.flex-row(v-for="child in item.key")
							i.d-footer-hot-key-text(v-if="child.type === 'text'") {{ child.value }}
							span.d-footer-hot-key-item(v-if="child.type === '+'") +
							img.d-footer-hot-key-img(v-if="child.type === 'img'", :src="child.value")
	.d-footer-bar.fn-flex(:style="{ marginLeft: 'auto' }")
		label {{ zoom }}
	.d-footer-bar.fn-flex
		d-svg.pointer(icon-class="zoomOut", @click="handleZoomOut")
	.d-footer-bar.fn-flex
		d-svg.pointer(icon-class="zoomIn", @click="handleZoomIn")
	.d-footer-bar.fn-flex(:style="{ marginRight: '0' }")
		i-icon.pointer(
			:type="platform.fullscreen ? 'md-contract' : 'md-expand'",
			:size="18",
			@click="handleFullscreen")
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
		'i-icon': Icon,
	},
})
export default class footer extends Vue {
	platform = platform.state
	scene = scene.state
	showHotKey: boolean = false

	get zoom() {
		const zoom = new BigNumber(this.platform.ruler.zoom)
		return `${zoom.multipliedBy(100)}%`
	}

	handleFullscreen() {
		if (this.platform.fullscreen) {
			document.exitFullscreen()
		} else {
			document.body.requestFullscreen()
		}
	}

	handleZoomIn() {
		platform.actions.zoomIn()
	}

	handleZoomOut() {
		platform.actions.zoomOut()
	}
}
</script>
<style lang="scss" scoped>
@import '../../../src/scss/conf';

.d-footer {
	height: 32px;
	padding: 0 15px;
	background-color: #313239;
}

.d-footer-bar-box {
	right: 0;
	bottom: 15px;
	user-select: none;
}

.d-footer-bar {
	align-items: center;
	justify-content: center;
	height: 100%;
	margin-right: 15px;
	color: $white_08;
	border-radius: 2px;
	opacity: 0.5;
	transition: all 0.3s;

	&:hover {
		opacity: 1;
	}
}

.d-footer-hot-keys,
.d-footer-info {
	align-items: center;
	justify-content: center;
}

.d-footer-info {
	margin-left: 10px;
}

.d-footer-hot-keys {
	width: 100%;
	height: 100%;

	.d-footer-hot-key-list {
		bottom: 100%;
		padding: 10px;
		color: #717171;
		pointer-events: none;
		background: #fff;
		border: 1px solid $borderColor;
		border-radius: 2px;
		opacity: 0;
		transition: all 0.3s;
		transform: translate3d(0, -20px, 0);

		li {
			align-items: center;
			padding: 4px 0;
			white-space: nowrap;

			label {
				margin-right: auto;
			}

			.d-footer-name {
				padding: 3px 10px;
				text-align: right;
				letter-spacing: 0;
			}

			.d-footer-key-code {
				padding-right: 10px;
			}

			.d-footer-hot-key-img {
				width: 22px;
				padding: 0 2px;
				text-align: center;
			}

			.d-footer-hot-key-text {
				min-width: 22px;
				padding: 0 4px;
				font-style: normal;
				text-align: center;
				border: 1px solid #ddd;
				border-radius: 2px;
			}
		}

		&.active {
			opacity: 1;
			transform: translate3d(0, 0, 0);
		}
	}

	&:hover {
		color: $white;
	}
}
</style>
