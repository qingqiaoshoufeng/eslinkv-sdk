import base from './base'
import { detail } from '@/api/screen.api'
export default class ScreenPc extends base {
	private static _instance: ScreenPc

	constructor(obj: any) {
		super()
		this.init(obj)
	}

	public static getInstance(obj: any): ScreenPc {
		if (this._instance == null) {
			console.log(obj)
			this._instance = new ScreenPc(obj)
		}
		return ScreenPc._instance
	}

	public init(obj: any) {
		console.log(obj)
		if (obj) {
			detail({ screenId: obj.screenId }).then(res => {
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
				this.screenId = res.screenId
			})
		}
	}
}
