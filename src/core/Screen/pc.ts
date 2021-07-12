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
			res.screenWidgets[key] = {
				name: res.screenWidgets[key].config.widget.name,
				componentId: res.screenWidgets[key].market
					? res.screenWidgets[key].config.widget.componentVersion
					: null,
				componentVersion: res.screenWidgets[key].market
					? res.screenWidgets[key].config.widget.componentVersion
					: null,
				...res.screenWidgets[key],
			}
		}
		this.serialize(screenWidgets)
		return { screenWidgets }
	}
}
