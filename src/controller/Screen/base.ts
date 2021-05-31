import { update } from '@/api/screen.api'
import { Message } from 'view-design'
import { debounce } from 'throttle-debounce'
import scene from './scene'
import Vue from 'vue'

export default class ScreenBase extends scene {
	/* 大屏ID */
	public screenId = ''
	/* 大屏名 */
	public screenName = '未命名'
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
	public screenType = ''
	/* 已废弃 */
	/* 大屏发布情况 EDIT:未发布 COMPLETE:已发布*/
	public screenPublish = ''
	/* 大屏缩略图 */
	public screenAvatar = ''
	get avatar() {
		return this.screenAvatar
	}
	set avatar(screenAvatar: string) {
		this.screenAvatar = screenAvatar
		this.updateScreen({ screenAvatar })
	}

	/* 大屏版本号 */
	public screenVersion = ''
	/* 大屏适配方式 */
	public screenLayoutMode = ''
	get layoutMode() {
		return this.screenLayoutMode
	}
	set layoutMode(screenLayoutMode: string) {
		this.screenLayoutMode = screenLayoutMode
		this.updateScreen({ screenLayoutMode })
	}
	/* 备注 */
	public remark = ''
	/* 排序 */
	public sort = 1
	/* 创建时间 */
	public createTime: string
	/* 更新时间 */
	public updateTime: string
	/* 大屏宽度 */
	public screenWidth = 1920
	get width() {
		return this.screenWidth
	}
	set width(screenWidth: number) {
		this.screenWidth = screenWidth
		Vue.prototype.$ruler.resetZoom()
		this.updateScreen({ screenWidth })
	}
	/* 大屏高度 */
	public screenHeight = 1080
	get height() {
		return this.screenHeight
	}
	set height(screenHeight: number) {
		this.screenHeight = screenHeight
		Vue.prototype.$ruler.resetZoom()
		this.updateScreen({ screenHeight })
	}
	/* 大屏背景颜色 */
	public screenBackGroundColor = 'rgba(24, 27, 36,1)'
	get backgroundColor() {
		return this.screenBackGroundColor
	}
	set backgroundColor(screenBackGroundColor: string) {
		this.screenBackGroundColor = screenBackGroundColor
		this.updateScreen({ screenBackGroundColor })
	}
	/* 大屏背景图片 */
	public screenBackGroundImage = ''
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
		this.screenMainScene = screenMainScene
		this.updateScreen({ screenMainScene })
	}
	/* 大屏平台类型 PC:PC */
	public screenPlatform: string

	updateScreen = debounce(1500, false, function (obj: any) {
		if (this.screenId) {
			update({
				screenId: this.screenId,
				...obj,
			}).then(() => {
				Message.success('修改成功')
			})
		}
	})
	/* 大屏状态 inEdit  在编辑器中  inPreview 在预览中*/
	status = 'inEdit'

	setStatus(status) {
		this.status = status
	}
}
