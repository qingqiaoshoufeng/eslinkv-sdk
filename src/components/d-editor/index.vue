<template lang="pug">
    // 操作区
    // todo css 改造 适配组件嵌入式，非全屏
    .center(ref="canvas-wrapper"
        :class="{ fullscreen: platform.fullscreen }"
        class=""
        @click="hideSubPanels"
        @select.prevent.stop
        @contextmenu.stop.prevent)
        // 标尺容器
        ruler-canvas(ref="rulerCanvas")
            // 大屏
            section#kanban(
                :style="canvasStyle"
                :class="['canvas-wrapper', { preview: !platform.ruler.rulerVisible }]"
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
                        :class="[{'no-pointer': isDragIn,locked: item.config.widget.locked,preview: !platform.ruler.rulerVisible,'widget-hide': item.config.widget.hide}, `widget-${item.id}`]"
                        :widget-info="`${item.id} ${item.config.widget.name || ''}`"
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
                // 辅助线
                span.ref-line.v-line(v-for="(item, index) in vLine"
                    v-show="item.display"
                    :style="{ left: item.position, top: item.origin, height: item.lineLength }"
                    :key="`v-${index}`")
                span.ref-line.h-line(v-for="(item, index) in hLine"
                    v-show="item.display"
                    :style="{ top: item.position, left: item.origin, width: item.lineLength }"
                    :key="`h-${index}`")
        // 右键菜单
        right-menu(ref="rightMenu" @deactivateWidget="deactivateWidget")
        // 数仓配置面板
        database-config(ref="dataBaseConfig" :showModal="showDatabaseConfigModal" @close="showDatabaseConfigModal = false" @update="updateApiSystem" @keyup.native.stop)
        // 看板配置
        d-right-manage
        // 小工具清单
        d-right-widget
        // 编辑器版本
        d-right-git
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
	import dRightWidget from '../d-right-widget'
	import dRightGit from '../d-right-git'
	import dFooter from '../d-footer'
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
			vdr,
			databaseConfig,
			dRightManage,
			dRightWidget,
			dRightGit,
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
	@import 'index';
</style>
