import { uuid } from '@/core/utils'

export default class Widget {
	id: string
	type: string
	config: any
	widgetType = 'normal'
	scene: number | string
	market: boolean
	children = {}
	settingDataHandle = []
	settingData = {}
	eventTypes = []
	customEventsConfig: any[]
	events = {}
	// 组件动画
	animation = {
		transitionEnable: true,
		type: 'fadeIn',
		enter: 600,
		leave: 0,
	}
	constructor(
		offsetX: number,
		offsetY: number,
		data: any,
		currentSceneIndex: number | string,
		currentMaxZIndex: number,
	) {
		const {
			// settingDataHandle = [],
			// settingData = {},
			// eventTypes = [],
			// events = {},
			type,
			config: inputConfig,
			startX,
			startY,
			market = false,
			componentVersion,
			componentId,
		} = data
		this.type = type
		// this.settingDataHandle = settingDataHandle
		// this.settingData = settingData
		// this.eventTypes = eventTypes
		// this.events = events
		this.market = market
		this.scene = currentSceneIndex
		const { layout = {}, config = {}, widget = {}, api } = inputConfig || {}
		if (!layout.size) layout.size = {}
		if (!layout.position) layout.position = {}
		const top = offsetY - startY
		const left = offsetX - startX
		layout.position.top = top
		layout.position.left = left
		layout.zIndex = currentMaxZIndex
		this.id = uuid()
		widget.id = this.id
		widget.componentVersion = componentVersion
		widget.componentId = componentId
		this.config = {
			layout,
			widget,
			config,
			api,
		}
	}
}
