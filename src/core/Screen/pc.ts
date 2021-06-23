import ScreenBase from '@/core/Screen/base'
import { setDefault } from '@/core/utils'

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
		this.screenId = res.screenId
		this.screenName = res.screenName
		this.screenAvatar = res.screenAvatar
		this.screenPublish = res.screenPublish
		this.screenType = res.screenType
		this.screenVersion = res.screenVersion
		this.screenLayoutMode = res.screenLayoutMode
		this.sort = res.sort
		this.createTime = res.createTime
		this.updateTime = res.updateTime
		res.screenConfig = res.screenConfig || {}
		this.screenConfig = res.screenConfig
		this.screenWidth = res.screenWidth
			? res.screenWidth
			: res.screenConfig.width
		delete this.screenConfig.width
		this.screenHeight = res.screenHeight
			? res.screenHeight
			: res.screenConfig.height
		delete this.screenConfig.height
		this.screenBackGroundColor = res.screenBackGroundColor
			? res.screenBackGroundColor
			: res.screenConfig.backgroundColor
		delete this.screenConfig.backgroundColor
		this.screenBackGroundImage = res.screenBackGroundImage
			? res.screenBackGroundImage
			: res.screenConfig.backgroundImage
		delete this.screenConfig.backgroundImage
		this.screenMainScene = res.screenMainScene
			? res.screenMainScene
			: res.screenConfig.mainScene
		delete this.screenConfig.mainScene
		this.screenPlatform = res.screenPlatform
		return this.initWidget(res)
	}
	/* 序列化children */
	serialize(screenWidgets): void {
		for (const key in screenWidgets) {
			setDefault(screenWidgets[key].config)
			if (screenWidgets[key].market) {
				this.marketComponents.push({
					type: screenWidgets[key].type,
					version: screenWidgets[key].config.widget.componentVersion,
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
		let screenWidgets
		const obj = {}
		if (res.screenConfig.widgets) {
			screenWidgets = res.screenConfig.widgets
			screenWidgets.forEach(item => {
				obj[item.id] = {
					id: item.id,
					market: item.market,
					scene: item.scene,
					type: item.type,
					config: item.value,
					settingDataHandle: [],
					settingData: {},
					children: {},
				}
			})
			screenWidgets = obj
			delete this.screenConfig.widgets
		} else {
			screenWidgets = res.screenWidgets || {}
		}
		this.serialize(screenWidgets)
		return { screenWidgets }
	}
}
