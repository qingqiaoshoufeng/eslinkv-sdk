<template lang="pug">
dr(
	:key="item.id",
	:ref="`widget_${item.id}`",
	:id="item.id",
	:scale-ratio="editor.zoom",
	:draggable="widgetEditable(item)",
	:resizable="widgetEditable(item)",
	:scale="item.config.layout.scale",
	:active="item.id === editor.chooseWidgetId && widgetEditable(item)",
	:w="item.config.layout.size.width",
	:h="item.config.layout.size.height",
	:x="item.config.layout.position.left",
	:y="item.config.layout.position.top",
	:z="item.config.layout.zIndex",
	:snap="editor.autoAlignGuide",
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
		:market="item.market",)
</template>
<script lang="ts">
import dr from '../../components/d-dr/index.vue'
import dDrKuang from '../../components/d-dr-kuang/index.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import parts from '../d-widget-part/index.vue'
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

	showRightMenu(e, item) {
		e.preventDefault()
		this.handleActivated(this.editor.screenWidgets[item.id])
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
			this.editor.screenWidgets[this.editor.chooseWidgetId].config.layout
				.position.left
		const diffTop =
			top -
			this.editor.screenWidgets[this.editor.chooseWidgetId].config.layout
				.position.top
		this.editor.screenWidgets[
			this.editor.chooseWidgetId
		].config.layout.position.left = left
		this.editor.screenWidgets[
			this.editor.chooseWidgetId
		].config.layout.position.top = top
		this.onGroupDragStop(
			this.editor.screenWidgets[this.editor.chooseWidgetId],
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
		this.editor.screenWidgets[
			this.editor.chooseWidgetId
		].config.layout.size.width = width
		this.editor.screenWidgets[
			this.editor.chooseWidgetId
		].config.layout.size.height = height
	}

	widgetEditable({ config }): boolean {
		return !config.widget.locked && !config.widget.hide
	}

	handleActivated(obj: any): void {
		const { config, id, type, children } = obj
		if (config.widget.hide) {
			return
		}
		this.editor.setChooseWidget(id)
		if (children && this.editor.chooseWidgetChildId) {
			this.editor.setChooseWidgetCustomConfig(
				children.find(v => v.id === this.editor.chooseWidgetChildId)
					.config.customConfig,
			)
		} else {
			this.editor.setChooseWidgetCustomConfig(config.customConfig)
		}
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
