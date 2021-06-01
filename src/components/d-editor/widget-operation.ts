import { uuid } from '@/utils'
import { Vue, Component } from 'vue-property-decorator'

@Component
class Mixins extends Vue {
	currentWidgetType = null
	screen: ScreenV = {}
	updateWidget(value) {
		if (!value || !value.widget) return
		const id = value.widget.id
		const currentWidget = this.screen.screenWidgets[id]
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
		layout.zIndex =
			this.screen.sortByZIndexWidgetsList[0].config.layout.zIndex + 1
		const value = {
			layout,
			widget,
			config,
			api,
		}
		this.screen.setWidgetItem(
			id,
			type,
			null,
			this.screen.sceneIndex,
			market,
		)
		this.updateWidget(value)
		this.currentWidgetType = type
	}

	handleActivated(obj) {
		const { config, id, type } = obj
		if (config.widget.hide) {
			return
		}
		this.screen.setChooseWidget(id)
		this.screen.setChooseWidgetCustomConfig(config.customConfig)
		this.currentWidgetType = type
	}

	mounted() {
		this.screen = this.$screen
	}
}

export default Mixins
