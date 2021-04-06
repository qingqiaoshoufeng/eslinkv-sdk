import { uuid } from '../../utils/index'
import { Vue, Component, Watch } from 'vue-property-decorator'
import platform from '../../store/platform.store'
import scene from '../../store/scene.store'

@Component
class Mixins extends Vue {
	currentWidgetType = null
	widgetProcessingStyle = null
	rightMenuBindWidgetId = null
	widgetMovingTimer = null
	widgetActivating = false
	widgetMoving = false
	currentWidgetValue = null
	platform = platform.state
	scene = scene.state
	configPanelValueUpdateTimer = null

	updateConfigPanelValue(id, oldId) {
		const update = () => {
			const configPanel = this.$refs.configPanel
			if (oldId) {
				configPanel && (configPanel as any).reset()
				this.$nextTick(() => {
					this.currentWidgetValue = this.widgetAdded[id].config
				})
			} else {
				this.currentWidgetValue = this.widgetAdded[id].config
			}
			this.configPanelValueUpdateTimer = null
		}
		this.configPanelValueUpdateTimer &&
			clearTimeout(this.configPanelValueUpdateTimer)
		this.configPanelValueUpdateTimer = setTimeout(update, 380)
	}

	handleWidgetConfig({ value = {} }, item) {
		this.updateWidget(value)
	}

	updateWidget(value) {
		if (this.widgetMoving || !value || !value.widget) return
		const id = value.widget.id
		const currentWidget = this.widgetAdded[id]
		if (!id || !currentWidget) return
		this.$set(currentWidget, 'config', value)
	}

	showProcessing(top, left, width, height, widget) {
		this.widgetProcessingStyle = `
                transform: translate3d(${left}px, ${top}px, 0);
                width: ${width}px;
                height: ${height}px;
            `
	}

	initWidgetConfig(id, type, scene, market) {
		platform.actions.setWidgetsAddedItem(id, type, null, scene, market)
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
		const { width, height } = layout.size
		// 小工具初始化提示
		this.showProcessing(top, left, width, height, widget)
		const id = uuid()
		if (layout.zIndex) layout.zIndex = 10
		widget.id = id
		widget.componentVersion = componentVersion
		widget.componentId = componentId // todo delete
		const value = { layout, widget, config, api }
		this.initWidgetConfig(id, type, this.scene.index, market)
		this.updateWidget(value)
		this.currentWidgetType = type
		return id
	}

	handleActivated(obj, activeAllowed = true) {
		const { config, id, type } = obj
		if (!activeAllowed) {
			return this.deactivateWidget(id)
		}
		platform.actions.chooseWidget(id)
		platform.actions.setChooseWidgetCustomConfig(config.customConfig)
		if (this.widgetActivating) return
		this.widgetActivating = true
		this.currentWidgetType = type
		this.platform.chooseWidgetId = id
		setTimeout(() => {
			this.widgetActivating = false
		}, 300)
	}

	handleDeactivated(item) {
		if (!this.widgetEditable(item)) {
			this.platform.chooseWidgetId = null
			platform.actions.unChooseWidget()
		}
	}

	/**
	 * @description 刷新以取消选定状态
	 */
	deactivateWidget(id) {
		this.$nextTick(() => {
			const widget = this.$refs[`widget_${id}`]
			if (!widget || !widget[0]) return
			widget[0].enabled = false
			this.platform.chooseWidgetId = null
			platform.actions.unChooseWidget()
		})
	}

	markWidgetMoving() {
		if (this.widgetMovingTimer) clearTimeout(this.widgetMovingTimer)
		this.widgetMoving = true
		this.widgetMovingTimer = setTimeout(() => {
			this.widgetMoving = false
			this.updateWidget(this.currentWidgetValue)
			this.widgetMovingTimer = null
		}, 50)
	}

	widgetEditable({ config }) {
		return !config.widget.locked && !config.widget.hide
	}

	@Watch('platform.chooseWidgetId')
	onActivatedWidgetIdChange(id, oldId) {
		if (!id) return

		if (
			(this.currentWidgetValue &&
				id === this.currentWidgetValue.widget.id) ||
			!id
		)
			return
		this.updateConfigPanelValue(id, oldId)
	}

	@Watch('currentWidgetValue.layout', { deep: true })
	onCurrentWidgetValueLayoutChange() {
		this.markWidgetMoving()
	}

	@Watch('currentWidgetValue', { deep: true })
	onCurrentWidgetValueChange(value) {
		value && this.updateWidget(value)
	}
}

export default Mixins
