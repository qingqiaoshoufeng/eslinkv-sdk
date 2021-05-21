<template lang="pug">
.d-footer.fn-flex.flex-row.pos-r.z-index-999
	.d-footer-bar.fn-flex.flex-row
		.d-footer-bar-text.ellipsis {{ scene.index === 0 ? '主场景' : scene.index === -1 ? '回收站' : scene.obj[scene.index].name }}
		.d-footer-bar-text {{ platform.width }}×{{ platform.height }}px
	.d-footer-bar.fn-flex
		label.d-footer-hot-keys.pos-r.fn-flex.flex-row
			.d-footer-bar-text.pointer.ellipsis(@click="showHotKey = !showHotKey") 快捷键
			.d-footer-hot-key-list.pos-a(:class="{ active: showHotKey }")
				ul
					li.fn-flex.flex-row(v-for="item in hotKeys", :key="item.name")
						label.d-footer-name {{ item.name }}
						.d-footer-key-code.fn-flex.flex-row(v-for="child in item.key")
							.d-footer-hot-key-text(v-if="child.type === 'text'") {{ child.value }}
							.d-footer-hot-key-item(v-if="child.type === '+'") +
							img.d-footer-hot-key-img(
								v-if="child.type === 'img'",
								:src="child.value")
	.d-footer-bar.fn-flex(title="缩小" :style="{ marginLeft: 'auto' }")
		d-svg.pointer(icon-class="zoomOut", @click="handleZoomOut")
	.d-footer-bar.fn-flex
		label {{ zoom }}
	.d-footer-bar.fn-flex(title="放大")
		d-svg.pointer(icon-class="zoomIn", @click="handleZoomIn")
	.d-footer-bar.fn-flex(title="最佳比例")
		d-svg.pointer(icon-class="smile", @click="handleResetZoom")
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
import ruler from '../../store/ruler.store'
import { Icon } from 'view-design'

@Component({
	components: {
		'i-icon': Icon,
	},
})
export default class DFooter extends Vue {
	platform = platform.state
	scene = scene.state
	ruler = ruler.state
	showHotKey = false
	hotKeys = []

	get zoom() {
		const zoom = this.ruler.zoom
		return `${~~(zoom * 100)}%`
	}

	handleFullscreen() {
		if (this.platform.fullscreen) {
			document.exitFullscreen()
		} else {
			document.body.requestFullscreen()
		}
	}

	handleResetZoom() {
		ruler.actions.resetZoom()
	}

	handleZoomIn() {
		ruler.actions.zoomIn(10)
	}

	handleZoomOut() {
		ruler.actions.zoomOut(10)
	}

	mounted() {
		const alt = this.platform.isMac ? '⌥' : 'Alt'
		const ctrl = this.platform.isMac ? '⌃' : 'Ctrl'
		const shift = 'Shift'
		const space = '空格'
		// const command = '⌘'
		const mouseWheelImg =
			'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ3ICg0NTM5NikgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNfbW91c2U8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0i55S75p2/IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iQXJ0Ym9hcmQtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwMi4wMDAwMDAsIC0zNi4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwMi4wMDAwMDAsIDM2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9ImljL21vdXNlL2dyZXk2MDAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuNTAwMDAwLCAwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJpY19tb3VzZV8yNHB4Ij4KICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjAgMCAxNSAwIDE1IDE2IDAgMTYiPjwvcG9seWdvbj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTguMTI1LDAuNzEzMzMzMzMzIEw4LjEyNSw2IEwxMi41LDYgQzEyLjUsMy4yOCAxMC41OTM3NSwxLjA0IDguMTI1LDAuNzEzMzMzMzMzIFogTTIuNSwxMCBDMi41LDEyLjk0NjY2NjcgNC43Mzc1LDE1LjMzMzMzMzMgNy41LDE1LjMzMzMzMzMgQzEwLjI2MjUsMTUuMzMzMzMzMyAxMi41LDEyLjk0NjY2NjcgMTIuNSwxMCBMMTIuNSw3LjMzMzMzMzMzIEwyLjUsNy4zMzMzMzMzMyBMMi41LDEwIFogTTYuODc1LDAuNzEzMzMzMzMzIEM0LjQwNjI1LDEuMDQgMi41LDMuMjggMi41LDYgTDYuODc1LDYgTDYuODc1LDAuNzEzMzMzMzMzIFoiIGlkPSJTaGFwZSIgZmlsbD0iIzhDOTA5NyIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS0yIiBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkE5MDAiIHg9IjYuNSIgeT0iMiIgd2lkdGg9IjMiIGhlaWdodD0iNyIgcng9IjEuNSI+PC9yZWN0PgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4='
		// const mouseLeftImg =
		//	'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTVweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTUgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ3ICg0NTM5NikgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNfbW91c2VfbGVmdDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSLnlLvmnb8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZC0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTYuMDAwMDAwLCAtNDIuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJpY19tb3VzZV9sZWZ0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1Ni4wMDAwMDAsIDQyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjAgMCAxNSAwIDE1IDE2IDAgMTYiPjwvcG9seWdvbj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik04LjEyNSwwLjcxMzMzMzMzMyBMOC4xMjUsNiBMMTIuNSw2IEMxMi41LDMuMjggMTAuNTkzNzUsMS4wNCA4LjEyNSwwLjcxMzMzMzMzMyBaIE0yLjUsMTAgQzIuNSwxMi45NDY2NjY3IDQuNzM3NSwxNS4zMzMzMzMzIDcuNSwxNS4zMzMzMzMzIEMxMC4yNjI1LDE1LjMzMzMzMzMgMTIuNSwxMi45NDY2NjY3IDEyLjUsMTAgTDEyLjUsNy4zMzMzMzMzMyBMMi41LDcuMzMzMzMzMzMgTDIuNSwxMCBaIiBpZD0iU2hhcGUiIGZpbGw9IiM5RkEyQTgiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTYuODc1LDAuNzEzMzMzMzMzIEM0LjQwNjI1LDEuMDQgMi41LDMuMjggMi41LDYgTDYuODc1LDYgTDYuODc1LDAuNzEzMzMzMzMzIFoiIGlkPSJQYXRoIiBmaWxsPSIjRkZBOTAwIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=='
		// const mouseRightImg =
		//	'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTVweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTUgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ3ICg0NTM5NikgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNfbW91c2VfbGVmdDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSLnlLvmnb8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZC0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTYuMDAwMDAwLCAtNDIuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJpY19tb3VzZV9sZWZ0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1Ni4wMDAwMDAsIDQyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjAgMCAxNSAwIDE1IDE2IDAgMTYiPjwvcG9seWdvbj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik04LjEyNSwwLjcxMzMzMzMzMyBMOC4xMjUsNiBMMTIuNSw2IEMxMi41LDMuMjggMTAuNTkzNzUsMS4wNCA4LjEyNSwwLjcxMzMzMzMzMyBaIE0yLjUsMTAgQzIuNSwxMi45NDY2NjY3IDQuNzM3NSwxNS4zMzMzMzMzIDcuNSwxNS4zMzMzMzMzIEMxMC4yNjI1LDE1LjMzMzMzMzMgMTIuNSwxMi45NDY2NjY3IDEyLjUsMTAgTDEyLjUsNy4zMzMzMzMzMyBMMi41LDcuMzMzMzMzMzMgTDIuNSwxMCBaIiBpZD0iU2hhcGUiIGZpbGw9IiM5RkEyQTgiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTYuODc1LDAuNzEzMzMzMzMzIEM0LjQwNjI1LDEuMDQgMi41LDMuMjggMi41LDYgTDYuODc1LDYgTDYuODc1LDAuNzEzMzMzMzMzIFoiIGlkPSJQYXRoIiBmaWxsPSIjRkZBOTAwIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=='
		this.hotKeys = [
			{
				name: '清除全部参考线',
				key: [
					{ value: alt, type: 'text' },
					{ type: '+' },
					{ value: 'C', type: 'text' },
				],
			},
			{
				name: '缩放画布',
				key: [
					{ value: ctrl, type: 'text' },
					{ type: '+' },
					{ value: mouseWheelImg, type: 'img' },
				],
			},
			{ name: '移动画布', key: [{ value: space, type: 'text' }] },
			{ name: '删除组件', key: [{ value: 'delete', type: 'text' }] },
			{
				name: '水平移动画布',
				key: [
					{ value: shift, type: 'text' },
					{ type: '+' },
					{ value: mouseWheelImg, type: 'img' },
				],
			},
			{
				name: '垂直移动画布',
				key: [{ value: mouseWheelImg, type: 'img' }],
			},
		]
	}
}
</script>
<style lang="scss" scoped>
.d-footer {
	height: 32px;
	padding: 0 15px;
	background-color: #24262e;
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
	color: var(--white_08);
	user-select: none;
	border-radius: 2px;
	transition: all 0.3s;

	.d-footer-bar-text {
		opacity: 0.5;
	}

	&:hover {
		.d-footer-bar-text {
			opacity: 1;
		}
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
		width: 230px;
		padding: 10px 10px 0 10px;
		color: var(--white_06);
		pointer-events: none;
		background: #2d2f38;
		border-radius: 2px;
		box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.57);
		opacity: 0;
		transition: all 0.3s;
		transform: translate3d(0, -20px, 0);

		li {
			align-items: center;
			height: 44px;
			white-space: nowrap;
			border-bottom: 1px solid #22242b;

			&:last-child {
				border-bottom: none;
			}

			.d-footer-key-code {
				&:last-child {
					.d-footer-hot-key-text {
						margin-right: 0;
					}
				}
			}

			label {
				margin-right: auto;
			}

			.d-footer-name {
				padding: 3px 10px;
				text-align: right;
				letter-spacing: 0;
			}

			.d-footer-hot-key-img {
				margin-left: 6px;
			}

			.d-footer-hot-key-text {
				margin-right: 10px;
				margin-left: 10px;
			}

			.d-footer-hot-key-img {
				width: 18px;
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
		color: var(--white);
	}
}
</style>
