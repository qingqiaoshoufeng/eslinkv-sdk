import base from './base'
import Vue from 'vue'
import { detail } from '@/api/screen.api'
export default class ScreenPc extends base {
	constructor(obj: any) {
		super()
		this.init(obj)
	}

	public static getInstance(obj: any): ScreenPc {
		if (
			!Vue.prototype.$screen ||
			Object.keys(Vue.prototype.$screen).length === 0
		) {
			Vue.prototype.$screen = new ScreenPc(obj)
			console.log(Vue.prototype.$screen)
		}
	}

	private serialize(res) {
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
		this.screenHeight = res.screenHeight
			? res.screenHeight
			: res.screenConfig.height
		this.screenBackGroundColor = res.screenBackGroundColor
			? res.screenBackGroundColor
			: res.screenConfig.backgroundColor
		this.screenBackGroundImage = res.screenBackGroundImage
			? res.screenBackGroundImage
			: res.screenConfig.backgroundImage
		this.screenMainScene = res.screenMainScene
			? res.screenMainScene
			: res.screenConfig.mainScene
		this.screenPlatform = res.screenPlatform
		this.initScene(res)
		this.screenWidgets = res.screenWidgets
			? res.screenWidgets
			: res.screenConfig.widgets
		this.screenId = res.screenId
	}

	public init(obj: any) {
		if (obj.screenId) {
			detail({ screenId: obj.screenId }).then(res => {
				this.serialize(res)
			})
		}
	}
}
