import { update, create } from '@/api/screen.api'
import { Message } from 'view-design'
import { debounce } from 'throttle-debounce'
import scene from './scene'
import Vue from 'vue'
import copy from 'fast-copy'
import commonConfigValue from '../../../common-config-value'
import { screenShareUpdate } from '@/api/screenShare.api'
import { getQueryString } from '@/utils'

export default class Screen extends scene {
	/* 大屏ID */
	public screenId = ''
	/* 大屏名 */
	public screenName = '未命名'

	get name() {
		return this.screenName
	}

	set name(screenName: string) {
		this.screenName = screenName
		this.updateScreenDebounce({ screenName })
	}

	/* 已废弃 */
	/* 大屏配置 */
	public screenConfig: any = {}
	/* 大屏组件配置 */
	public screenWidgets: any = {}
	/* 获取大屏组件配置——根据zIndex排序 */
	get sortByZIndexWidgetsList() {
		const list = []
		for (const key in this.screenWidgets) {
			const item = this.screenWidgets[key]
			if (item.scene === this.sceneIndex) {
				list.push(item)
			}
		}
		list.sort((a, b) => {
			return b.config.layout.zIndex - a.config.layout.zIndex - 1
		})
		return list
	}
	set sortByZIndexWidgetsList(val) {
		console.log(val)
	}

	/* 更新大屏组件配置 */
	setWidgetItem(id, type, config, scene, market = false) {
		Vue.set(this.screenWidgets, id, {
			id,
			type,
			config,
			scene,
			market,
		})
	}

	/* 更新大屏组件配置 */
	updateWidgetConfig(id, config) {
		if (this.screenWidgets[id])
			Vue.set(this.screenWidgets[id], 'config', config)
	}

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
		this.updateScreenDebounce({ screenAvatar })
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
		this.updateScreenDebounce({ screenLayoutMode })
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
		if (Object.keys(Vue.prototype.$ruler).length)
			Vue.prototype.$ruler.resetZoom()
		if (this.screenId) this.updateScreenDebounce({ screenWidth })
	}

	/* 大屏高度 */
	public screenHeight = 1080

	get height() {
		return this.screenHeight
	}

	set height(screenHeight: number) {
		this.screenHeight = screenHeight
		if (Object.keys(Vue.prototype.$ruler).length)
			Vue.prototype.$ruler.resetZoom()
		if (this.screenId) this.updateScreenDebounce({ screenHeight })
	}

	/* 大屏背景颜色 */
	public screenBackGroundColor = 'rgba(24, 27, 36,1)'

	get backgroundColor() {
		return this.screenBackGroundColor
	}

	set backgroundColor(screenBackGroundColor: string) {
		this.screenBackGroundColor = screenBackGroundColor
		this.updateScreenDebounce({ screenBackGroundColor })
	}

	/* 大屏背景图片 */
	public screenBackGroundImage = ''

	get backgroundImage() {
		return this.screenBackGroundImage
	}

	set backgroundImage(screenBackGroundImage: string) {
		this.screenBackGroundImage = screenBackGroundImage
		this.updateScreenDebounce({ screenBackGroundImage })
	}

	/* 大屏首屏场景 */
	public screenMainScene: string

	get mainScene() {
		return this.screenMainScene
	}

	set mainScene(screenMainScene: string) {
		this.screenMainScene = screenMainScene
		this.updateScreenDebounce({ screenMainScene })
	}

	/* 大屏平台类型 PC:PC */
	public screenPlatform: string
	/* 更新大屏信息 防抖：1500ms */
	updateScreenDebounce = debounce(1500, false, function (obj: any) {
		if (this.screenId) {
			update({
				screenId: this.screenId,
				...obj,
			}).then(() => {
				Message.success('修改成功')
			})
		}
	})

	/* 大屏样式 */
	get screenStyle() {
		let scaleX = 0,
			scaleY = 1,
			actualScaleRatio = 1,
			scale = ''
		const { clientWidth, clientHeight } = document.body
		const layoutMode = getQueryString('layoutMode')
		switch (layoutMode) {
			case 'full-size':
				scaleX = clientWidth / this.width
				scaleY = clientHeight / this.height
				break
			case 'full-width':
				actualScaleRatio = clientWidth / this.width
				break
			case 'full-height':
				actualScaleRatio = clientHeight / this.height
				break
		}
		if (layoutMode === 'full-size') {
			scale = `${scaleX},${scaleY}`
		} else {
			scale = `${actualScaleRatio}`
		}
		return {
			width: `${this.width}px`,
			height: `${this.height}px`,
			backgroundColor: this.backgroundColor,
			backgroundImage: `url(${this.backgroundImage})`,
			overflow: 'hidden',
			transform: `scale(${scale}) translate3d(0, 0, 0)`,
		}
	}

	/* 大屏状态 inEdit  在编辑器中  inPreview 在预览中*/
	status = 'inEdit'

	setStatus(status) {
		this.status = status
	}

	/* 大屏平台状态 是否Mac*/
	isMac = /macintosh|mac os x/i.test(navigator.userAgent)
	/* 大屏平台状态 是否移动端*/
	isMobile = /android|iphone/i.test(navigator.userAgent)
	/* 大屏平台状态 是否全屏*/
	fullscreen = false
	/* 大屏平台状态 是否自动贴靠参考线*/
	autoAlignGuide = true

	screenData() {
		const defaultConfig = commonConfigValue() // 读取默认配置
		const widgetAdded = copy(this.screenWidgets)
		const widgets = Object.values(widgetAdded)
			.map(
				({ id, market = false, type, config, scene = 0, children }) => {
					const api = config.api
					if (api && api.data) {
						try {
							api.data = JSON.stringify(JSON.parse(api.data))
						} catch (e) {
							console.warn(e)
						}
					}
					checkAttr(config, '', defaultConfig)
					return {
						id,
						scene,
						type,
						market,
						value: { ...config },
						children,
					}
				},
			)
			.filter(item => item.scene !== -1)
		return {
			screenScene: this.sceneObj,
			screenWidgets: widgets,
			screenType: this.screenType,
			screenConfig: this.screenConfig,
		}
	}

	createScreen() {
		return new Promise((resolve, reject) => {
			const data = this.screenData()
			create(data)
				.then(res => {
					Message.success('保存成功！')
					resolve(1)
					screenShareUpdate({
						screenId: res.screenId,
						screenGuide: Vue.prototype.$ruler.guideLines,
					})
				})
				.catch(() => {
					reject(1)
				})
		})
	}

	updateScreen() {
		return new Promise((resolve, reject) => {
			const data = this.screenData()
			update({
				...data,
				screenId: this.screenId,
			})
				.then(() => {
					Message.success('修改成功')
					resolve(1)
				})
				.catch(() => {
					reject(1)
				})
		})
	}
}
function getAttr(o, str) {
	const arr = str.split('.')
	let res = o
	for (const v of arr) {
		if (res[v] === undefined) {
			res = {}
			break
		}
		res = res[v]
	}
	return res
}
function checkAttr(o, str = '', defaultConfig) {
	for (const key in o) {
		const prop = str ? str + '.' + key : key
		if (Array.isArray(o[key]) && o[key].length > 0) {
			if (
				JSON.stringify(o[key]) ===
				JSON.stringify(getAttr(defaultConfig, prop))
			) {
				o[key] = 'default'
			}
		} else if (
			Object.prototype.toString.call(o[key]) === '[object Object]'
		) {
			if (
				JSON.stringify(o[key]) ===
				JSON.stringify(getAttr(defaultConfig, prop))
			) {
				o[key] = 'default'
			} else {
				checkAttr(o[key], prop, defaultConfig)
			}
		}
	}
}
