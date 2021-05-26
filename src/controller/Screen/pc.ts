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
			this._instance = new ScreenPc(obj)
		}
		return ScreenPc._instance
	}

	public init(obj: any) {
		if (obj) {
			detail({ screenId: obj.screenId }).then(res => {
				this.screenId = res.screenId
				this.screenName = res.screenName
				this.screenPublish = res.screenPublish
				this.screenType = res.screenType
				this.screenVersion = res.screenVersion
				this.screenLayoutMode = res.screenLayoutMode
				this.sort = res.sort
				this.createTime = res.createTime
				this.updateTime = res.updateTime
				this.screenConfig = res.screenConfig
				console.log(this)
			})
		}
	}
}
