import { update } from '@/api/screen.api'
import { Message } from 'view-design'
import { debounce } from 'throttle-debounce'
import scene from './scene'
export default class ScreenBase extends scene {
	/* 大屏ID */
	public screenId: string = ''
	/* 大屏名 */
	public screenName: string = ''
	get name() {
		return this.screenName
	}
	set name(screenName: string) {
		this.screenName = screenName
		this.updateScreen({ screenName })
	}
	/* 已废弃 */
	/* 大屏配置 */
	public screenConfig: any = {}
	/* 大屏组件配置 */
	public screenWidgets: any = []
	/* 大屏类型 CUSTOM:大屏 TEMPLATE:模版 */
	public screenType: string = ''
	/* 已废弃 */
	/* 大屏发布情况 EDIT:未发布 COMPLETE:已发布*/
	public screenPublish: string = ''
	/* 大屏缩略图 */
	public screenAvatar: string = ''
	get avatar() {
		return this.screenAvatar
	}
	set avatar(screenAvatar: string) {
		this.screenAvatar = screenAvatar
		this.updateScreen({ screenAvatar })
	}

	/* 大屏版本号 */
	public screenVersion: string = ''
	/* 大屏适配方式 */
	public screenLayoutMode: string = ''
	get layoutMode() {
		return this.screenLayoutMode
	}
	set layoutMode(screenLayoutMode: string) {
		this.screenLayoutMode = screenLayoutMode
		this.updateScreen({ screenLayoutMode })
	}
	/* 备注 */
	public remark: string = ''
	/* 排序 */
	public sort: number = 1
	/* 创建时间 */
	public createTime: string
	/* 更新时间 */
	public updateTime: string
	/* 大屏宽度 */
	public screenWidth: number = 1920
	get width() {
		return this.screenWidth
	}
	set width(screenWidth: number) {
		this.screenWidth = screenWidth
		this.updateScreen({ screenWidth })
	}
	/* 大屏高度 */
	public screenHeight: number = 1080
	get height() {
		return this.screenHeight
	}
	set height(screenHeight: number) {
		this.screenHeight = screenHeight
		this.updateScreen({ screenHeight })
	}
	/* 大屏背景颜色 */
	public screenBackGroundColor: string = 'rgba(24, 27, 36,1)'
	get backgroundColor() {
		return this.screenBackGroundColor
	}
	set backgroundColor(screenBackGroundColor: string) {
		this.screenBackGroundColor = screenBackGroundColor
		this.updateScreen({ screenBackGroundColor })
	}
	/* 大屏背景图片 */
	public screenBackGroundImage: string
	get backgroundImage() {
		return this.screenBackGroundImage
	}
	set backgroundImage(screenBackGroundImage: string) {
		this.screenBackGroundImage = screenBackGroundImage
		this.updateScreen({ screenBackGroundImage })
	}
	/* 大屏首屏场景 */
	public screenMainScene: string
	get mainScene() {
		return this.screenMainScene
	}
	set mainScene(screenMainScene: string) {
		this.screenBackGroundImage = screenMainScene
		this.updateScreen({ screenMainScene })
	}
	/* 大屏平台类型 PC:PC */
	public screenPlatform: string
}

ScreenBase.prototype.updateScreen = debounce(1500, false, function (obj: any) {
	if (this.screenId) {
		update({
			screenId: this.screenId,
			...obj,
		}).then(() => {
			Message.success('修改成功')
		})
	}
})
