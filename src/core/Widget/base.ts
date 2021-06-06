import { uuid } from '@/core/utils'

export default class Widget {
	id: string
	type: string
	config: any
	scene: number | string
	market: boolean
	children = []
	constructor(
		e: any,
		data: any,
		currentSceneIndex: number | string,
		currentMaxZIndex: number,
	) {
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
		this.type = type
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
