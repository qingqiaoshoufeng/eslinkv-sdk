<template lang="pug">
    // 操作区
    // todo css 改造 适配组件嵌入式，非全屏
    .center.pos-r(ref="canvas-wrapper"
        :class="{ fullscreen: platform.fullscreen }"
       :style="{width: `calc(100% - ${platform.ruler.xRoom+platform.ruler.xRoomR}px)`,marginLeft:`${platform.ruler.xRoom}px`}"
        @click="hideSubPanels"
        @select.prevent.stop
        @contextmenu.stop.prevent)
        // 标尺容器
        ruler-canvas(ref="rulerCanvas")
            // 大屏
            #kanban(
                :style="canvasStyle"
                :class="['canvas-wrapper', { preview: false }]"
                @dragenter="isDragIn = true"
                @dragleave.self="isDragIn = false"
                @drop="drop"
                @dragover.prevent
                @mousedown.self="deactivateWidget(activatedWidgetId)")
                // 小工具清单
                template(v-for="item in platform.widgetAdded")
                    vdr(v-if="showParts(item)"
                        :key="item.id"
                        :ref="`widget_${item.id}`"
                        :parent="true"
                        :parent-size="canvasSize"
                        :scale-ratio="platform.ruler.zoom"
                        :draggable="widgetEditable(item)"
                        :resizable="widgetEditable(item)"
                        :active="item.id === activatedWidgetId && widgetEditable(item)"
                        :prevent-deactivation="true"
                        :w="item.config.layout.size.width"
                        :h="item.config.layout.size.height"
                        :x="item.config.layout.position.left"
                        :y="item.config.layout.position.top"
                        :z="item.config.layout.zIndex"
                        :snap="platform.autoAlignGuide"
                        :snap-tolerance="10"
                        :class="[{'no-pointer': isDragIn,locked: item.config.widget.locked,preview: false,'widget-hide': item.config.widget.hide}, `widget-${item.id}`]"
                        snap-to-target="guide-line"
                        class-name="vdr-custom-style"
                        @resizing="onResizing"
                        @dragging="onDragging"
                        @refLineParams="getRefLineParams"
                        @activated="handleActivated(item, widgetEditable(item) && !item.config.widget.innerEditing)"
                        @deactivated="handleDeactivated(item)"
                        @contextmenu.native="showRightMenu($event, item)")
                        parts(
                            :ref="item.id"
                            :type="item.type"
                            :config="item.config"
                            :market="item.market"
                            @widget-config-update="(data) => handleWidgetConfig(data, item)")
        // 参考线
        d-guide
        // 右键菜单
        right-menu(ref="rightMenu" @deactivateWidget="deactivateWidget")
        // 数仓配置面板
        database-config(ref="dataBaseConfig" :showModal="showDatabaseConfigModal" @close="showDatabaseConfigModal = false" @update="updateApiSystem" @keyup.native.stop)
        d-footer
</template>
<script>
	import rightMenu from '../right-menu/index'
	import rulerCanvas from '../d-ruler/index.vue'
	import vdr from 'vue-draggable-resizable-gorkys2/src/components/vue-draggable-resizable'
	import 'vue-draggable-resizable-gorkys2/src/components/vue-draggable-resizable.css'
	import parts from '../d-widget-part/index'
	import widgetOperation from './widget-operation'
	import databaseConfig from '../data-warehouse/index.vue'
	import dRightManage from '../d-right-manage'
	import dFooter from '../d-footer'
	import dGuide from '../d-guide'
	import platform from '../../store/platform.store'
	import instance from '../../store/instance.store'
	import scene from '../../store/scene.store'
	import styleParser from '../../../style-parser'

	export default {
		name: 'kanboard-editor',
		mixins: [
			widgetOperation
		],
		components: {
			parts,
			rulerCanvas,
			dFooter,
			dGuide,
			vdr,
			databaseConfig,
			dRightManage,
			rightMenu
		},
		provide () {
			return { kanboardEditor: this }
		},
		data () {
			return {
				platform: platform.state,
				scene: scene.state,
				vLine: [],
				hLine: [],
				isDragIn: false,
				showDatabaseConfigModal: false
			}
		},
		methods: {
			handleFullscreenChange () {
				this.platform.fullscreen = !this.platform.fullscreen
			},
			showRightMenu (e, item) {
				e.preventDefault()
				this.handleActivated(this.platform.widgetAdded[item.id])
				const rightMenu = this.$refs.rightMenu.$el
				rightMenu.classList.add('active')
				rightMenu.style.left = e.clientX + 'px'
				rightMenu.style.top = e.clientY + 'px'
			},
			drop (e) {
				this.isDragIn = false
				const widgetConfig = e.dataTransfer.getData('widget-config')
				if (widgetConfig) {
					this.handleWidgetDrop(e, widgetConfig)
				}
			},
			updateApiSystem (value) {
				Object.assign(this.currentWidgetValue.api.system.params, value)
				this.showDatabaseConfigModal = false
			},
			onDragging (left, top) {
				this.platform.widgetAdded[this.platform.chooseWidgetId].config.layout.position.left = left
				this.platform.widgetAdded[this.platform.chooseWidgetId].config.layout.position.top = top
			},
			onResizing (left, top, width, height) {
				this.platform.widgetAdded[this.platform.chooseWidgetId].config.layout.size.width = width
				this.platform.widgetAdded[this.platform.chooseWidgetId].config.layout.size.height = height
			},
			getRefLineParams ({ vLine, hLine }) {
				this.vLine = vLine
				this.hLine = hLine
			},
			hideSubPanels () {
				this.$refs.rightMenu && this.$refs.rightMenu.$el.classList.remove('active')
			}
		},
		computed: {
			canvasStyle () {
				return styleParser(this.platform.panelConfig)
			},
			canvasSize () {
				const { width, height } = this.platform.panelConfig.size
				return { width, height }
			},
			widgetAdded () {
				return this.platform.widgetAdded
			},
			showParts () {
				return (item) => {
					if (item.scene === 0 && this.scene.showMainScene) {
						return true
					}
					if (item.scene === this.scene.index) {
						return true
					}
					return false
				}
			}
		},
		beforeDestroy () {
			this.platform.fullscreen = false
			document.removeEventListener('fullscreenchange', this.handleFullscreenChange)
		},
		watch: {
			isDragIn (value) {
				if (value) this.hideSubPanels()
			}
		},
		mounted () {
			document.addEventListener('fullscreenchange', this.handleFullscreenChange)
			platform.actions.initKanboard()
			instance.actions.setInstance('kanboard', this)
			scene.actions.setStatus('inEdit')
		}
	}
</script>
<style lang="scss" scoped>
@import "src/scss/conf";

.center {
	z-index: 1;
	height: 100%;
	padding: 0;
	margin: 0;
	background-color: #363946;

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

	&.preview {
		.vdr-custom-style {
			outline: none;

			&::after,
			&::before {
				display: none;
			}
		}
	}
}

.ref-line {
	background-color: #0ff;
}

.vdr-custom-style {
	border: none;

	&.active {
		cursor: move;
		outline: 1px solid $themeColor_08;
	}

	&::after {
		position: absolute;
		top: -15px;
		left: 0;
		font-size: 12px;
		line-height: 1.2;
		color: #a9a979;
		transition: 0.2s;
	}

	&:not(.locked)::before {
		cursor: move;
	}

	&::after {
		right: -3px;
		left: unset;
		content: '\1F512';
		opacity: 0;
	}

	&.locked::after {
		opacity: 0.5;
	}

	&:hover,
	&.widget-hover {
		outline: 1px solid $themeColor_08;
	}

	&.locked:hover {
		outline: 1px solid $themeColor_04;

		&::after {
			opacity: 1;
		}
	}

	&.locked {
		outline: none;
	}

	&.widget-hide {
		pointer-events: none !important;
		opacity: 0;

		* {
			pointer-events: none !important;
		}
	}

	.widget-dragging {
		pointer-events: none !important;
	}

	&::v-deep {
		.widget,
		.widget-part {
			// 看板编辑中，小工具的定位样式由 vue-draggable-resizable-gorkys 接管
			position: relative !important;
			top: 0 !important;
			left: 0 !important;
			//width: 100% !important;
			//height: 100% !important;
		}

		.handle {
			z-index: 999;
			width: 4px;
			height: 4px;
			border: none;
			border-radius: 4px;
			box-shadow: none;
		}

		.handle-ml {
			left: -3px;
			margin-top: -2px;
		}

		.handle-bl {
			bottom: -2px;
			left: -3px;
		}

		.handle-bm {
			bottom: -2px;
		}

		.handle-br {
			right: -3px;
			bottom: -2px;
		}

		.handle-mr {
			right: -3px;
			margin-top: -2px;
		}

		.handle-tr {
			top: -2px;
			right: -3px;
		}

		.handle-tm {
			top: -2px;
		}

		.handle-tl {
			top: -2px;
			left: -3px;
		}
	}
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
	transition:
		transform 0.34s cubic-bezier(0.5, 0, 0.5, 1),
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
			box-shadow:
				-16px 0 0 0 rgba(0, 0, 0, 0.15),
				16px 0 0 0 rgba(0, 0, 0, 0.15),
				-32px 0 0 0 rgba(0, 0, 0, 0.1),
				32px 0 0 0 rgba(0, 0, 0, 0.1);
		}
	}
}

.canvas-config-wrapper {
	pointer-events: none;
	opacity: 0;
	transition:
		transform 0.5s cubic-bezier(0.5, 0, 0.5, 1),
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
