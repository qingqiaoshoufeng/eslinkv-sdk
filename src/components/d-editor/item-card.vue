<template lang="pug">
dr(
	v-if="showParts(item)",
	:key="item.id",
	:ref="`widget_${item.id}`",
	:id="item.id",
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
	:class="[{ locked: item.config.widget.locked, 'dr-hide': item.config.widget.hide }, `widget-${item.id}`]",
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
		:children="item.children",
		:market="item.market",
		@widget-config-update="data => handleWidgetConfig(data, item)")
</template>
<script lang="ts">
import dr from '../../components/d-dr/index.vue'
import dDrKuang from '../../components/d-dr-kuang/index.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import scene from '@/store/scene.store.js'
import platform from '@/store/platform.store.js'
import parts from '../d-widget-part/index.vue'
import event from '@/store/event.store.js'
import ruler from '../../store/ruler.store'
@Component({
	components: {
		dr,
		dDrKuang,
		parts,
	},
})
export default class ItemCard extends Vue {
	scene = scene.state
	ruler = ruler.state
	platform = platform.state
	currentWidgetType = null
	event = event.state

	@Prop() item
	@Prop() getRefLineParams
	@Prop({ default: false }) inDr

	get style() {
		return {
			transform: `translate3d(${this.item.config.layout.position.left}px, ${this.item.config.layout.position.top}px,0)`,
			width: this.item.config.layout.size.width + 'px',
			height: this.item.config.layout.size.height + 'px',
			zIndex: this.item.config.layout.zIndex,
		}
	}
	get showParts() {
		return item => {
			if (item.scene === 0) {
				return true
			}
			if (item.scene === this.scene.index) {
				return true
			}
			return false
		}
	}

	showRightMenu(e, item) {
		e.preventDefault()
		this.handleActivated(this.platform.widgetAdded[item.id])
		const rightMenu = document.getElementById('right-menu')
		rightMenu.classList.add('active')
		if (e.clientY + rightMenu.scrollHeight > window.innerHeight) {
			rightMenu.style.top = e.clientY - rightMenu.scrollHeight + 'px'
		} else {
			rightMenu.style.top = e.clientY + 'px'
		}
		rightMenu.style.left = e.clientX + 'px'
	}

	onDragStop(left, top) {
		const diffLeft =
			left -
			this.platform.widgetAdded[this.platform.chooseWidgetId].config
				.layout.position.left
		const diffTop =
			top -
			this.platform.widgetAdded[this.platform.chooseWidgetId].config
				.layout.position.top
		this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.layout.position.left = left
		this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.layout.position.top = top
		this.onGroupDragStop(
			this.platform.widgetAdded[this.platform.chooseWidgetId],
			diffLeft,
			diffTop,
		)
	}

	onGroupDragStop(item, diffLeft, diffTop) {
		if (item.children) {
			item.children.map(child => {
				child.config.layout.position.left += diffLeft
				child.config.layout.position.top += diffTop
				this.onGroupDragStop(child, diffLeft, diffTop)
			})
		}
	}

	// @ts-ignore
	onResizeStop(left, top, width, height) {
		this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.layout.size.width = width
		this.platform.widgetAdded[
			this.platform.chooseWidgetId
		].config.layout.size.height = height
	}

	widgetEditable({ config }) {
		return !config.widget.locked && !config.widget.hide
	}

	handleActivated(obj) {
		const { config, id, type } = obj
		if (config.widget.hide) {
			return
		}
		platform.actions.chooseWidget(id)
		platform.actions.setChooseWidgetCustomConfig(config.customConfig)
		this.currentWidgetType = type
		this.platform.chooseWidgetId = id
	}

	handleWidgetConfig({ value = {} }) {
		this.updateWidget(value)
	}

	updateWidget(value) {
		if (!value || !value.widget) return
		const id = value.widget.id
		const currentWidget = this.platform.widgetAdded[id]
		if (!id || !currentWidget) return
		this.$set(currentWidget, 'config', value)
	}
}
</script>
<style lang="scss" scoped>
.widget-part-edit {
	.widget-part {
		position: relative !important;
		transform: translate3d(0, 0, 0) !important;
	}
}
</style>
