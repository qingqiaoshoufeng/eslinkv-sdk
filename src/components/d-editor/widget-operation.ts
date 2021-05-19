import { uuid } from '../../utils/index'
import { Vue, Component } from 'vue-property-decorator'
import platform from '../../store/platform.store'
import scene from '../../store/scene.store'

@Component
class Mixins extends Vue {
	currentWidgetType = null
	platform = platform.state
	scene = scene.state

	initWidgetConfig(id, type, scene, market) {
		platform.actions.setWidgetsAddedItem(id, type, null, scene, market)
	}
	updateWidget(value) {
		if (!value || !value.widget) return
		const id = value.widget.id
		const currentWidget = this.platform.widgetAdded[id]
		if (!id || !currentWidget) return
		this.$set(currentWidget, 'config', value)
	}
	// 小工具放置到画布
	handleWidgetDrop(e, data) {
		const { offsetX, offsetY } = e
		const {
			type,
			config: inputConfig,
			startX,
			startY,
			market = false,
			componentVersion,
			componentId,
		} = JSON.parse(data)
		const { layout = {}, config = {}, widget = {}, api } = inputConfig || {}
		if (!layout.size) layout.size = {}
		if (!layout.position) layout.position = {}
		const top = offsetY - startY
		const left = offsetX - startX
		layout.position.top = top
		layout.position.left = left
		const id = uuid()
		if (layout.zIndex) layout.zIndex = 10
		widget.id = id
		widget.componentVersion = componentVersion
		widget.componentId = componentId
		const value = { layout, widget, config, api }
		this.initWidgetConfig(id, type, this.scene.index, market)
		this.updateWidget(value)
		this.currentWidgetType = type
		return id
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
}

export default Mixins
