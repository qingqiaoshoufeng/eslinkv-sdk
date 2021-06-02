<template lang="pug">
dr(
	v-if="showParts(item)",
	:key="item.id",
	:ref="`widget_${item.id}`",
	:id="item.id",
	:scale-ratio="editor.zoom",
	:draggable="widgetEditable(item)",
	:resizable="widgetEditable(item)",
	:scale="item.config.layout.scale",
	:active="item.id === screen.chooseWidgetId && widgetEditable(item)",
	:w="item.config.layout.size.width",
	:h="item.config.layout.size.height",
	:x="item.config.layout.position.left",
	:y="item.config.layout.position.top",
	:z="item.config.layout.zIndex",
	:snap="screen.autoAlignGuide",
	:class="[{ locked: item.config.widget.locked, 'dr-hide': item.config.widget.hide }, `widget-${item.id}`]",
	:snap-to-target="['.d-editor-line', '.dr-unactive']",
	@resizestop="onResizeStop",
	@refLineParams="params => getRefLineParams(params, item)",
	@dragstop="onDragStop",
	@activated="handleActivated(item)",
	@contextmenu.native="showRightMenu($event, item)")
	parts(
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
import parts from '../d-widget-part/index.vue'
import event from '@/store/event.store.js'
import Editor from '@/core/Editor'

@Component({
	components: {
		dr,
		dDrKuang,
		parts,
	},
})
export default class ItemCard extends Vue {
	editor = Editor.Instance()
	screen = this.$screen
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
			if (item.scene === this.screen.sceneIndex) {
				return true
			}
			return false
		}
	}

	showRightMenu(e, item) {
		e.preventDefault()
		this.handleActivated(this.screen.screenWidgets[item.id])
		const rightMenu = document.getElementById('right-menu')
		rightMenu.classList.add('active')
		if (e.clientY + rightMenu.scrollHeight > window.innerHeight) {
			rightMenu.style.top = e.clientY - rightMenu.scrollHeight + 'px'
		} else {
			rightMenu.style.top = e.clientY + 'px'
		}
		rightMenu.style.left = e.clientX + 'px'
	}

	onDragStop(left: number, top: number) {
		const diffLeft =
			left -
			this.screen.screenWidgets[this.screen.chooseWidgetId].config.layout
				.position.left
		const diffTop =
			top -
			this.screen.screenWidgets[this.screen.chooseWidgetId].config.layout
				.position.top
		this.screen.screenWidgets[
			this.screen.chooseWidgetId
		].config.layout.position.left = left
		this.screen.screenWidgets[
			this.screen.chooseWidgetId
		].config.layout.position.top = top
		this.onGroupDragStop(
			this.screen.screenWidgets[this.screen.chooseWidgetId],
			diffLeft,
			diffTop,
		)
	}

	onGroupDragStop(item, diffLeft: number, diffTop: number) {
		if (item.children) {
			item.children.map(child => {
				child.config.layout.position.left += diffLeft
				child.config.layout.position.top += diffTop
				this.onGroupDragStop(child, diffLeft, diffTop)
			})
		}
	}

	onResizeStop(width: number, height: number) {
		this.screen.screenWidgets[
			this.screen.chooseWidgetId
		].config.layout.size.width = width
		this.screen.screenWidgets[
			this.screen.chooseWidgetId
		].config.layout.size.height = height
	}

	widgetEditable({ config }) {
		return !config.widget.locked && !config.widget.hide
	}

	handleActivated(obj) {
		const { config, id, type, children } = obj
		if (config.widget.hide) {
			return
		}
		this.screen.setChooseWidget(id)
		if (children && this.screen.chooseWidgetChildId) {
			this.screen.setChooseWidgetCustomConfig(
				children.find(v => v.id === this.screen.chooseWidgetChildId)
					.config.customConfig,
			)
		} else {
			this.screen.setChooseWidgetCustomConfig(config.customConfig)
		}
		this.currentWidgetType = type
		this.screen.chooseWidgetId = id
	}

	handleWidgetConfig({ value = {} }) {
		this.updateWidget(value)
	}

	updateWidget(value) {
		if (!value || !value.widget) return
		const id = value.widget.id
		const currentWidget = this.screen.screenWidgets[id]
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

.dr-hide {
	display: none;
}
</style>
