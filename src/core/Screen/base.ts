import copy from 'fast-copy'
import commonConfigValue from '../../../common-config-value'
import { getQueryString } from '@/utils'
import Factory from '@/core/Base/factory'
import Widget from '@/core/Widget/base'

export default class Screen extends Factory<Screen> {
	/* 当前系统版本 */
	currentVersion = '1.1.0'
	/* 大屏ID */
	public screenId: string
	/* 大屏名 */
	public screenName = '未命名'
	/* 已废弃 */
	/* 大屏配置 */
	public screenConfig: any = {}
	/* 大屏组件配置 */
	public screenWidgets: any = {}
	
	get sceneWidgets () {
		const res = { 0: [] }
		for (const widgetId in this.screenWidgets) {
			if (!res[this.screenWidgets[widgetId].scene]) res[this.screenWidgets[widgetId].scene] = []
			res[this.screenWidgets[widgetId].scene].push(this.screenWidgets[widgetId])
		}
		return res
	}

	/* 更新大屏组件配置 */
	updateWidgetConfig(id, config) {
		if (this.screenWidgets[id]) this.screenWidgets[id].config = config
	}

	/* 大屏类型 CUSTOM:大屏 TEMPLATE:模版 */
	public screenType = ''
	/* 已废弃 */
	/* 大屏发布情况 EDIT:未发布 COMPLETE:已发布*/
	public screenPublish = ''
	/* 大屏缩略图 */
	public screenAvatar = ''
	/* 大屏版本号 */
	public screenVersion = ''
	/* 大屏适配方式 full-size 充满页面 full-width 100%宽度 full-height 100%高度 */
	public screenLayoutMode = ''
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
	/* 大屏高度 */
	public screenHeight = 1080
	/* 大屏背景颜色 */
	public screenBackGroundColor = 'rgba(24, 27, 36,1)'
	/* 大屏背景图片 */
	public screenBackGroundImage = ''
	/* 大屏首屏场景 */
	public screenMainScene: string | number
	/* 大屏平台类型 PC:PC */
	public screenPlatform: string

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
	editorStatus = 'inEdit'
	public updateEditorStatus(status: string): void {
		this.editorStatus = status
	}

	/* 大屏平台状态 是否Mac*/
	isMac = /macintosh|mac os x/i.test(navigator.userAgent)
	/* 大屏平台状态 是否移动端*/
	isMobile = /android|iphone/i.test(navigator.userAgent)
	/* 大屏平台状态 是否全屏*/
	fullscreen = false
	/* 大屏平台状态 是否自动贴靠参考线*/
	autoAlignGuide = true
	/* 获取大屏数据 */
	public screenData(): any {
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
			screenWidgets: widgets,
			screenType: this.screenType,
			screenConfig: this.screenConfig,
			screenAvatar: this.screenAvatar,
			screenBackGroundColor: this.screenBackGroundColor,
			screenBackGroundImage: this.screenBackGroundImage,
			screenHeight: this.screenHeight,
			screenWidth: this.screenWidth,
			screenName: this.screenName,
			screenPlatform: this.screenPlatform,
			screenVersion: this.screenVersion,
			screenLayoutMode: this.screenLayoutMode,
			screenMainScene: this.screenMainScene,
		}
	}
	/* 添加组件 */
	createWidget(
		e: any,
		currentSceneIndex: number | string,
		currentMaxZIndex: number,
	): void {
		const widgetConfig = e.dataTransfer.getData('widget-config')
		if (widgetConfig) {
			const widgetItem = new Widget(
				e,
				widgetConfig,
				currentSceneIndex,
				currentMaxZIndex,
			)
			this.screenWidgets = {
				...this.screenWidgets,
				[widgetItem.id]: widgetItem,
			}
		}
	}
	
	deleteWidget(id) {
		delete this.screenWidgets[id]
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
