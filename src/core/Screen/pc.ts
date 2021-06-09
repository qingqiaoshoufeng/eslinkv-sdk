import ScreenBase from '@/core/Screen/base'
import { setDefault } from '@/utils'
import Widget from '@/core/Widget/normal'

export default class ScreenPc extends ScreenBase {
	/* 递归查询组件 */
	searchWidget(widget: Widget, id: string): Widget {
		let res
		if (widget.children && id) {
			res = widget.children.find((v: Widget) => v.id === id)
		}
		if (!res) {
			for (const v of widget.children) {
				if (v.children) {
					res = this.searchWidget(v, id)
					if (res) break
				}
			}
		}
		return res
	}
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
	/* 序列化组件数据 */
	initWidget(res: any): any {
		let screenWidgets
		if (res.screenConfig.widgets) {
			screenWidgets = res.screenConfig.widgets
		} else {
			screenWidgets = res.screenWidgets || {}
		}
		const marketComponents: { type: string; version: string }[] = []
		for (const key in screenWidgets) {
			setDefault(screenWidgets[key].config)
			if (screenWidgets[key].market) {
				marketComponents.push({
					type: screenWidgets[key].type,
					version: screenWidgets[key].config.widget.componentVersion,
				})
			}
		}
		delete this.screenConfig.widgets
		return { marketComponents, screenWidgets }
	}
}
