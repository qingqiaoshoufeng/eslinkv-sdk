<template lang="pug">
// 操作区
// todo css 改造 适配组件嵌入式，非全屏
.d-editor.pos-r#d-editor(
	ref="canvas-wrapper",
	:class="{ fullscreen: platform.fullscreen }",
	:style="{ width: `calc(100% - ${ruler.xRoomL1 + ruler.xRoomL2 + ruler.xRoomR1}px)`, marginLeft: `${ruler.xRoomL1 + ruler.xRoomL2}px` }",
	@select.prevent.stop,
	@contextmenu.stop.prevent)
	// 标尺容器
	ruler-canvas(ref="rulerCanvas")
		// 大屏
		#kanban.canvas-wrapper.pos-r(
			:style="canvasStyle",
			@dragenter="isDragIn = true",
			@dragleave.self="isDragIn = false",
			@drop="drop",
			@click.stop,
			@mousedown.self="hideRightMenu",
			@dragover.prevent)
			// 小工具清单
			template(v-for="item in platform.widgetAdded")
				dr(
					v-if="showParts(item)",
					:key="item.id",
					:ref="`widget_${item.id}`",
					:scale-ratio="ruler.zoom",
					:draggable="widgetEditable(item)",
					:resizable="widgetEditable(item)",
					:scale="item.config.layout.scale",
					:active="item.id === platform.chooseWidgetId && widgetEditable(item)",
					:w="item.config.layout.size.width",
					:h="item.config.layout.size.height",
					:x="item.config.layout.position.left",
					:y="item.config.layout.position.top",
					:z="item.config.layout.zIndex",
					:snap="platform.autoAlignGuide",
					:class="[{ 'no-pointer': isDragIn, locked: item.config.widget.locked, 'dr-hide': item.config.widget.hide }, `widget-${item.id}`]",
					:snap-to-target="['.d-editor-line', '.dr-unactive']",
					@resizestop="onResizeStop",
					@refLineParams="params => getRefLineParams(params, item)",
					@dragstop="onDragStop",
					@activated="handleActivated(item)",
					@contextmenu.native="showRightMenu($event, item)")
					parts(
						:ref="item.id",
						:type="item.type",
						:config="item.config",
						:market="item.market",
						@widget-config-update="data => handleWidgetConfig(data, item)")
			.d-editor-line(data-top="0px", data-left="0px")
			.d-editor-line(
				:data-top="`${platform.panelConfig.size.height}${platform.panelConfig.size.unit}`",
				data-left="0px")
			.d-editor-line(
				data-top="0px",
				:style="{ width: 0, height: `${platform.panelConfig.size.height}${platform.panelConfig.size.unit}` }",
				:data-left="`${platform.panelConfig.size.width}${platform.panelConfig.size.unit}`")
			.d-editor-line(
				data-top="0px",
				data-left="0px",
				:style="{ height: `${platform.panelConfig.size.height}${platform.panelConfig.size.unit}`, width: 0 }")
			// 参考线
			span.ref-line.v-line.pos-a(
				v-for="item in vLine",
				v-show="item.display",
				:style="{ left: item.position, top: item.origin, height: item.lineLength }")
			span.ref-line.h-line.pos-a(
				v-for="item in hLine",
				v-show="item.display",
				:style="{ top: item.position, left: item.origin, width: item.lineLength }")
	d-guide
	// 右键菜单
	right-menu
	d-footer
	d-kuang
</template>
<script>
import rightMenu from '../right-menu/index'
import rulerCanvas from '../d-ruler/index.vue'
import dr from '../../components/d-dr'
import parts from '../d-widget-part/index'
import widgetOperation from './widget-operation'
import dRightManage from '../d-right-manage'
import dKuang from '../d-kuang'
import dFooter from '../d-footer'
import dGuide from '../d-guide'
import platform from '../../store/platform.store'
import instance from '../../store/instance.store'
import scene from '../../store/scene.store'
import ruler from '../../store/ruler.store'
export default {
	name: 'd-editor',
	mixins: [widgetOperation],
	components: {
		parts,
		rulerCanvas,
		dFooter,
		dGuide,
		dKuang,
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
			ruler: ruler.state,
			isDragIn: false,
			vLine: [],
			hLine: [],
		}
	},
	methods: {
		getRefLineParams(params, item) {
			const { vLine, hLine } = params
			this.vLine = vLine.map(child => {
				child.w = item.config.layout.size.width
				child.h = item.config.layout.size.height
				return child
			})
			this.hLine = hLine.map(child => {
				child.w = item.config.layout.size.width
				child.h = item.config.layout.size.height
				return child
			})
		},
		handleFullscreenChange() {
			this.platform.fullscreen = !this.platform.fullscreen
		},
		hideRightMenu() {
			platform.actions.unChooseWidget()
		},
		showRightMenu(e, item) {
			e.preventDefault()
			if (item.config.widget.locked) return
			this.handleActivated(this.platform.widgetAdded[item.id])
			const rightMenu = document.getElementById('right-menu')
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
		onDragStop(left, top) {
			this.platform.widgetAdded[
				this.platform.chooseWidgetId
			].config.layout.position.left = left
			this.platform.widgetAdded[
				this.platform.chooseWidgetId
			].config.layout.position.top = top
		},
		onResizeStop(left, top, width, height) {
			this.platform.widgetAdded[
				this.platform.chooseWidgetId
			].config.layout.size.width = width
			this.platform.widgetAdded[
				this.platform.chooseWidgetId
			].config.layout.size.height = height
		},
	},
	computed: {
		canvasStyle() {
			return {
				width: `${this.platform.panelConfig.size.width}${this.platform.panelConfig.size.unit}`,
				height: `${this.platform.panelConfig.size.height}${this.platform.panelConfig.size.unit}`,
				'background-color': this.platform.panelConfig.background.color,
				'background-image': `url(${this.platform.panelConfig.background.url})`,
			}
		},
		canvasSize() {
			const { width, height } = this.platform.panelConfig.size
			return { width, height }
		},
		showParts() {
			return item => {
				if (item.scene === 0) {
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
	mounted() {
		document.addEventListener(
			'fullscreenchange',
			this.handleFullscreenChange,
		)
		platform.actions.initPlatformConfig()
		instance.actions.setInstance('kanboard', this)
		scene.actions.setStatus('inEdit')
	},
}
</script>
<style lang="scss">
@import 'index.scss';
</style>
<style lang="scss" scoped>
.ref-line {
	background-color: var(--lineRed);
}
.v-line {
	width: 1px;
	height: 100%;
}
.h-line {
	width: 100%;
	height: 1px;
}
.d-editor {
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

.no-pointer {
	pointer-events: none;
}
</style>
