import ScreenBase from '@/core/Screen/base'

export default class ScreenPc extends ScreenBase {
	marketComponents = []
	/* 递归查询组件 */
	// searchWidget(widget: Widget, id: string): Widget {
	// 	let res
	// 	if (widget.children && id) {
	// 		res = widget.children.find((v: Widget) => v.id === id)
	// 	}
	// 	if (!res) {
	// 		for (const v of widget.children) {
	// 			if (v.children) {
	// 				res = this.searchWidget(v, id)
	// 				if (res) break
	// 			}
	// 		}
	// 	}
	// 	return res
	// }
	/* 初始化配置 */
	init(res: any): any {
		if (res.screenId) this.screenId = res.screenId
		this.screenName = res.screenName
		this.screenAvatar = res.screenAvatar
		this.screenPublish = res.screenPublish
		this.screenType = res.screenType || 'CUSTOM'
		this.screenVersion = res.screenVersion
		this.screenLayoutMode = res.screenLayoutMode || 'full-size'
		this.sort = res.sort
		this.createTime = res.createTime
		this.updateTime = res.updateTime
		this.screenWidth = res.screenWidth
		this.screenHeight = res.screenHeight
		this.screenBackGroundColor = res.screenBackGroundColor
		this.screenBackGroundImage = res.screenBackGroundImage
		this.screenMainScene = res.screenMainScene
		this.screenPlatform = res.screenPlatform
		return this.initWidget(res)
	}
	/* 序列化children */
	serialize(screenWidgets): void {
		for (const key in screenWidgets) {
			if (screenWidgets[key].market) {
				this.marketComponents.push({
					type: screenWidgets[key].type,
					version: screenWidgets[key].componentVersion,
				})
			}
			if (screenWidgets[key].children) {
				if (Object.values(screenWidgets[key].children).length > 0) {
					this.serialize(screenWidgets[key].children)
				}
			}
		}
	}
	/* 序列化组件数据 */
	initWidget(res: any): any {
		const screenWidgets = res.screenWidgets
		for (const key in screenWidgets) {
			let item = { ...res.screenWidgets[key] }
			item = {
				name: item.config.widget.name,
				componentId: item.market ? item.config.widget.componentVersion : null,
				componentVersion: item.market ? item.config.widget.componentVersion : null,
				...item,
			}
			// 兼容自定义事件
			if (item.config.eventType) {
				delete item.config.eventType
			}
			if (item.config.event) {
				if (!item.eventTypes) item.eventTypes = []
				item.eventTypes.push({ key: 'click', label: '点击事件' })
				if (item.config.event.scene) {
					if (!item.events) item.events = {}
					item.config.event.scene.forEach(child => {
						const triggerType = child.type
						delete child.type
						if (!item.events.click) item.events.click = []
						item.events.click.push({ ...child, eventClass: 'scene', eventType: 'click', triggerType })
					})
					delete item.config.event.scene
				}
				if (item.config.event.component) {
					if (!item.events) item.events = {}
					item.config.event.component.forEach(child => {
						const triggerType = child.type
						delete child.type
						if (!item.events.click) item.events.click = []
						item.events.click.push({ ...child, eventClass: 'component', eventType: 'click', triggerType })
					})
					delete item.config.event.component
				}
				delete item.config.event
			}
			screenWidgets[item.id] = item
		}
		this.serialize(screenWidgets)
		return { screenWidgets }
	}
}
