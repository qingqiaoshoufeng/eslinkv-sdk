<template lang="pug">
.widget-part-edit.pos-a(:style="style", v-if="showParts(item)")
	parts(
		:data-top="`${item.config.layout.position.top}px`",
		:data-left="`${item.config.layout.position.left}px`",
		:class="platform.chooseWidgetId === item.id ? '' : 'widget-part-fixed'",
		:ref="item.id",
		:type="item.type",
		:config="item.config",
		:market="item.market",
		@click.native="handleActivated(item)",
		@contextmenu.native="showRightMenu($event, item)",
		@widget-config-update="data => handleWidgetConfig(data, item)")
	d-dr-kuang
</template>
<script lang="ts">
import dDrKuang from '../../components/d-dr-kuang/index.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import scene from '@/store/scene.store.js'
import platform from '@/store/platform.store.js'
import parts from '../d-widget-part/index.vue'
import event from '@/store/event.store.js'

@Component({
	components: {
		dDrKuang,
		parts,
	},
})
export default class ItemCard extends Vue {
	scene = scene.state
	platform = platform.state
	currentWidgetType = null
	event = event.state

	@Prop() item
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
			if (this.inDr && item.type) {
				return true
			}
			if (
				this.platform.chooseWidgetId === item.id &&
				this.event.kuangDragging
			) {
				return false
			}
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
