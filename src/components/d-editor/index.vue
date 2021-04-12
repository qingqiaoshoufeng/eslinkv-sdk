<template lang="pug">
// 操作区
// todo css 改造 适配组件嵌入式，非全屏
.center.pos-r(
	ref="canvas-wrapper",
	:class="{ fullscreen: platform.fullscreen }",
	:style="{ width: `calc(100% - ${platform.ruler.xRoomL1 + platform.ruler.xRoomL2 + platform.ruler.xRoomR1}px)`, marginLeft: `${platform.ruler.xRoomL1 + platform.ruler.xRoomL2}px` }",
	@click="hideSubPanels",
	@select.prevent.stop,
	@contextmenu.stop.prevent)
	// 标尺容器
	ruler-canvas(ref="rulerCanvas")
		// 大屏
		#kanban.canvas-wrapper(
			:style="canvasStyle",
			@dragenter="isDragIn = true",
			@dragleave.self="isDragIn = false",
			@drop="drop",
			@click.stop,
			@dragover.prevent,
			@mousedown.self="deactivateWidget(platform.chooseWidgetId)")
			// 小工具清单
			template(v-for="item in platform.widgetAdded")
				dr(
					v-if="showParts(item)",
					:key="item.id",
					:ref="`widget_${item.id}`",
					:parent="true",
					:parent-size="canvasSize",
					:scale-ratio="platform.ruler.zoom",
					:draggable="widgetEditable(item)",
					:resizable="widgetEditable(item)",
					:active="item.id === platform.chooseWidgetId && widgetEditable(item)",
					:prevent-deactivation="true",
					:w="item.config.layout.size.width",
					:h="item.config.layout.size.height",
					:x="x === null ? item.config.layout.position.left : x",
					:y="y === null ? item.config.layout.position.top : y",
					:z="item.config.layout.zIndex",
					:snap="platform.autoAlignGuide",
					:class="[{ 'no-pointer': isDragIn, locked: item.config.widget.locked, preview: false, 'dr-hide': item.config.widget.hide }, `widget-${item.id}`]",
					snap-to-target="d-guide-line",
					@resizing="onResizing",
					@dragging="onDragging",
					@dragstop="onDragstop",
					@activated="handleActivated(item, widgetEditable(item))",
					@deactivated="handleDeactivated(item)",
					@contextmenu.native="showRightMenu($event, item)")
					parts(
						:ref="item.id",
						:type="item.type",
						:config="item.config",
						:market="item.market",
						@widget-config-update="data => handleWidgetConfig(data, item)")
	// 参考线
	d-guide
	// 右键菜单
	right-menu(ref="rightMenu", @deactivateWidget="deactivateWidget")
	d-footer
</template>
<script>
import rightMenu from '../right-menu/index'
import rulerCanvas from '../d-ruler/index.vue'
import dr from '../../components/d-draggable-resizable'
import parts from '../d-widget-part/index'
import widgetOperation from './widget-operation'
import dRightManage from '../d-right-manage'
import dFooter from '../d-footer'
import dGuide from '../d-guide'
import platform from '../../store/platform.store'
import instance from '../../store/instance.store'
import scene from '../../store/scene.store'
import styleParser from '../../../style-parser'

export default {
	name: 'kanboard-editor',
	mixins: [widgetOperation],
	components: {
		parts,
		rulerCanvas,
		dFooter,
		dGuide,
		dr,
		dRightManage,
		rightMenu,
	},
	provide() {
		return { kanboardEditor: this }
	},
	data() {
		return {
			platform: platform.state,
			scene: scene.state,
			isDragIn: false,
			x: null,
			y: null
		}
	},
	methods: {
		handleFullscreenChange() {
			this.platform.fullscreen = !this.platform.fullscreen
		},
		showRightMenu(e, item) {
			e.preventDefault()
			this.handleActivated(this.platform.widgetAdded[item.id])
			const rightMenu = this.$refs.rightMenu.$el
			rightMenu.classList.add('active')
			rightMenu.style.left = e.clientX + 'px'
			rightMenu.style.top = e.clientY + 'px'
		},
		drop(e) {
			this.isDragIn = false
			const widgetConfig = e.dataTransfer.getData('widget-config')
			if (widgetConfig) {
				this.handleWidgetDrop(e, widgetConfig)
			}
		},
		onDragstop(left, top) {
			this.platform.widgetAdded[
				this.platform.chooseWidgetId
			].config.layout.position.left = left
			this.platform.widgetAdded[
				this.platform.chooseWidgetId
			].config.layout.position.top = top
		},
		onDragging(left, top) {
			this.x = left
			this.y = top
		},
		onResizing(left, top, width, height) {
			this.platform.widgetAdded[
				this.platform.chooseWidgetId
			].config.layout.size.width = width
			this.platform.widgetAdded[
				this.platform.chooseWidgetId
			].config.layout.size.height = height
		},
		hideSubPanels() {
			this.$refs.rightMenu &&
				this.$refs.rightMenu.$el.classList.remove('active')
		},
	},
	computed: {
		canvasStyle() {
			return styleParser(this.platform.panelConfig)
		},
		canvasSize() {
			const { width, height } = this.platform.panelConfig.size
			return { width, height }
		},
		showParts() {
			return item => {
				if (item.scene === 0 && this.scene.showMainScene) {
					return true
				}
				if (item.scene === this.scene.index) {
					return true
				}
				return false
			}
		},
	},
	beforeDestroy() {
		this.platform.fullscreen = false
		document.removeEventListener(
			'fullscreenchange',
			this.handleFullscreenChange,
		)
	},
	watch: {
		isDragIn(value) {
			if (value) this.hideSubPanels()
		},
	},
	mounted() {
		document.addEventListener(
			'fullscreenchange',
			this.handleFullscreenChange,
		)
		platform.actions.initKanboard()
		instance.actions.setInstance('kanboard', this)
		scene.actions.setStatus('inEdit')
		this.x = this.platform.widgetAdded[
			this.platform.chooseWidgetId
			].config.layout.position.left
		this.y = this.platform.widgetAdded[
			this.platform.chooseWidgetId
			].config.layout.position.top
	},
}
</script>
<style lang="scss">
@import 'index.scss';
</style>
<style lang="scss" scoped>
@import 'src/scss/conf';

.center {
	background-color: #313239;
	transition: all 0.3s;

	&.fullscreen {
		position: fixed !important;
		top: 0 !important;
		right: 0 !important;
		bottom: 0 !important;
		left: 0 !important;
		box-sizing: border-box !important;
		width: 100% !important;
		min-width: 0 !important;
		max-width: none !important;
		height: 100% !important;
		min-height: 0 !important;
		max-height: none !important;
		margin: 0 !important;
		transform: none !important;
		object-fit: contain;
	}
}

#kanban {
	box-shadow: rgba(0, 0, 0, 0.5) 0 0 30px 0;
	transition: background-image 0.5s;

	&::before {
		display: flex;
		content: '';
	}
}

.ref-line {
	background-color: #0ff;
}

.canvas-config-wrapper,
.grid-config-panel-wrapper,
.config-panel-wrapper {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 2;
	width: 340px;
	height: 430px;
	padding: 25px 0 0 0;
	background-color: #2d8cf0;
	filter: drop-shadow(#2d8cf094 0 4px 4px);
	border: #2d8cf0 3px solid;
	border-top-width: 0;
	border-radius: 5px;
	opacity: 1;
	transition: transform 0.34s cubic-bezier(0.5, 0, 0.5, 1),
		opacity 0.2s cubic-bezier(0.5, 0, 0.5, 1);
	transform: translate3d(0, 0, 0);

	&::v-deep {
		& > .config-panel {
			width: 100% !important;
			height: 100% !important;
			padding: 5px;
			border-radius: 0 0 3px 3px;
		}
	}

	.top-toolbar {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 25px;
		color: white;

		.fix-panel,
		.close-panel {
			flex-grow: 0;
			flex-shrink: 0;
			width: 18px;
			height: 18px;
			font-size: 12px;
			font-weight: bold;
			line-height: 20px;
			color: #2d8cf0;
			text-align: center;
			letter-spacing: 0;
			cursor: pointer;
			background-color: white;
			border-radius: 50%;
			opacity: 0.5;
			transition: 0.2s;

			&:hover {
				opacity: 1;
			}
		}

		.drag-panel {
			flex-grow: 1;
			height: 25px;
			padding: 8px 20px;
			cursor: move;

			&::before {
				display: block;
				width: 100%;
				height: 100%;
				content: ' ';
				background-color: #e2e2e2;
				border-radius: 5px;
				transition: 0.2s;
			}

			&:hover {
				&::before {
					background-color: #e6e6e6;
				}
			}
		}
	}
}

.config-panel-wrapper {
	padding-right: 5px;
	padding-bottom: 5px;

	.resize-handle {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;

		&::before {
			display: block;
			content: '';
			background-color: #fff;
			border-radius: 1px;
			opacity: 0.4;
			transition: opacity 0.2s;
		}

		&.vertical {
			bottom: -3px;
			left: 0;
			width: 100%;
			height: 8px;
			cursor: ns-resize;

			&::before {
				width: 64px;
				height: 2px;
			}
		}

		&.horizontal {
			right: -3px;
			bottom: 0;
			width: 8px;
			height: calc(100% - 25px);
			cursor: ew-resize;

			&::before {
				width: 2px;
				height: 64px;
			}
		}

		&:hover::before {
			opacity: 0.7;
			transition: opacity 0.2s 0.2s;
		}
	}

	.config-value-updating {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background-color: #f2f2f2;

		.dot {
			width: 8px;
			height: 8px;
			background-color: rgba(0, 0, 0, 0.1);
			box-shadow: -16px 0 0 0 rgba(0, 0, 0, 0.15),
				16px 0 0 0 rgba(0, 0, 0, 0.15), -32px 0 0 0 rgba(0, 0, 0, 0.1),
				32px 0 0 0 rgba(0, 0, 0, 0.1);
		}
	}
}

.canvas-config-wrapper {
	pointer-events: none;
	opacity: 0;
	transition: transform 0.5s cubic-bezier(0.5, 0, 0.5, 1),
		opacity 0.5s cubic-bezier(0.5, 0, 0.5, 1);
	transform: translate3d(-50%, 0, 0);

	&.active {
		pointer-events: auto;
		opacity: 1;
		transform: translate3d(-50%, 10px, 0);
	}

	.panel-body {
		width: 100%;
		height: 100%;
		padding: 5px;
		overflow: hidden;
		background: #f2f2f2;
		border-radius: 0 0 3px 3px;
	}

	.canvas-config-panel {
		width: 100% !important;
		height: 100% !important;
		padding: 5px;
		overflow: hidden;
		overflow-y: auto;
	}

	&::after {
		position: absolute;
		top: 100%;
		right: 0;
		left: 0;
		width: 36px;
		height: 16px;
		margin: auto;
		font-size: 48px;
		line-height: 48px;
		color: #2d8cf0;
		text-align: center;
		pointer-events: none;
		content: '';
		filter: drop-shadow(#2d8cf094 0 4px 4px);
	}

	&::v-deep {
		.background-picker {
			height: 138px !important;
		}
	}
}

.grid-config-panel-wrapper {
	.top-toolbar {
		justify-content: center;
	}

	& > .config-panel {
		overflow-x: hidden;
	}
}

.widget-processing {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 100;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 15px;
	color: white;
	white-space: nowrap;
	background-color: gray;
}

.no-pointer {
	pointer-events: none;
}

.refill-mask {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 4;
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
	background-color: rgba(0, 0, 0, 0.4);
	opacity: 0;
	transition: 0.2s;

	&.active {
		pointer-events: auto;
		opacity: 1;

		& ~ div {
			filter: blur(7px);
		}
	}

	.mask-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 400px;

		.mask-title {
			font-size: 1.3em;
			line-height: 3;
			color: white;
		}
	}

	&::v-deep {
		.ivu-progress-inner {
			background-color: #717171;
		}
	}
}
</style>
