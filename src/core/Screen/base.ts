import { getQueryString, uuid } from '@/core/utils'
import Factory from '@/core/Base/factory'
import Widget from '@/core/Widget/base'
import copy from 'fast-copy'
import commonConfigValue from '@/core/common-config-value.js'
import { configMerge, versionToNum } from '@/core/utils'
export default class Screen extends Factory<Screen> {
	/* 当前系统版本 */
	currentVersion = '1.1.0'
	/* 大屏ID */
	screenId: string
	/* 大屏名 */
	screenName = '未命名'
	/* 大屏组件配置 */
	screenWidgets: any = {}
	/* 大屏类型 CUSTOM:大屏 TEMPLATE:模版 */
	screenType = 'CUSTOM'
	/* 已废弃 */
	/* 大屏发布情况 EDIT:未发布 COMPLETE:已发布*/
	screenPublish = ''
	/* 大屏缩略图 */
	screenAvatar = ''
	/* 大屏版本号 */
	screenVersion = ''
	/* 大屏适配方式 full-size 充满页面 full-width 100%宽度 full-height 100%高度 */
	screenLayoutMode = 'full-size'
	/* 备注 */
	remark = ''
	/* 排序 */
	sort = 1
	/* 创建时间 */
	createTime: string
	/* 更新时间 */
	updateTime: string
	/* 大屏宽度 */
	screenWidth = 1920
	/* 大屏高度 */
	screenHeight = 1080
	/* 大屏背景颜色 */
	screenBackGroundColor = 'rgba(24, 27, 36,1)'
	/* 大屏背景图片 */
	screenBackGroundImage = ''
	/* 大屏首屏场景 */
	screenMainScene: string | number
	/* 大屏平台类型 PC:PC */
	screenPlatform: string
	/* 更新大屏组件配置 */
	updateWidgetConfig(id: string, localConfigValue: any, customConfig: any): any {
		const mergedValue = localConfigValue
			? configMerge(localConfigValue, commonConfigValue(localConfigValue.widgetType))
			: commonConfigValue()
		this.findWidget(id, this.screenWidgets, mergedValue, localConfigValue, customConfig)
		// 过滤可用属性
	}
	private findWidget(id, obj, mergedValue, localConfigValue, customConfig = []): void {
		for (const key in obj) {
			if (id === obj[key].id) {
				const inputConfig = Object.freeze(obj[key].config || {})
				const res = configMerge(inputConfig, mergedValue)
				res.widget.name = res.widget.name || '未知组件'
				obj[key].widgetType = localConfigValue ? localConfigValue.widgetType || 'normal' : 'normal'
				if (customConfig) {
					customConfig.map(item => {
						if (!item.prop.includes('config.config')) {
							item.prop = `config.config.${item.prop}`
						}
					})
					res.customConfig = [{ type: 'custom' }, ...customConfig]
				}
				obj[key].config = res
			} else if (obj[key].children) {
				if (Object.values(obj[key].children).length > 0)
					this.findWidget(id, obj[key].children, mergedValue, localConfigValue, customConfig)
			}
		}
	}
	changeLayoutMode(value: string): string {
		let scaleX = 0,
			scaleY = 1,
			actualScaleRatio = 1,
			scale = ''
		const { clientWidth, clientHeight } = document.body
		switch (value) {
			case 'full-size':
				scaleX = clientWidth / this.screenWidth
				scaleY = clientHeight / this.screenHeight
				break
			case 'full-width':
				actualScaleRatio = clientWidth / this.screenWidth
				break
			case 'full-height':
				actualScaleRatio = clientHeight / this.screenHeight
				break
		}
		if (value === 'full-size') {
			scale = `${scaleX},${scaleY}`
		} else {
			scale = `${actualScaleRatio}`
		}
		return `scale(${scale}) translate3d(0, 0, 0)`
	}
	/* 大屏样式 */
	get screenStyle() {
		const layoutMode = getQueryString('layoutMode')
		return {
			width: `${this.screenWidth}px`,
			height: `${this.screenHeight}px`,
			backgroundColor: this.screenBackGroundColor,
			backgroundImage: `url(${this.screenBackGroundImage})`,
			overflow: 'hidden',
			transform: this.changeLayoutMode(layoutMode),
		}
	}

	/* 获取大屏数据 */
	screenData(): any {
		return {
			screenWidgets: this.screenWidgets,
			screenType: this.screenType,
			screenAvatar: this.screenAvatar,
			screenBackGroundColor: this.screenBackGroundColor,
			screenBackGroundImage: this.screenBackGroundImage,
			screenHeight: this.screenHeight,
			screenWidth: this.screenWidth,
			screenName: this.screenName,
			screenPlatform: this.screenPlatform,
			screenVersion: versionToNum(this.currentVersion),
			screenLayoutMode: this.screenLayoutMode,
			screenMainScene: this.screenMainScene,
		}
	}
	/* 添加组件 */
	createWidget(
		offsetX = 0,
		offsetY = 0,
		data: any,
		currentSceneIndex: number | string = 0,
		currentMaxZIndex = 10,
	): void {
		const widgetItem = new Widget(offsetX, offsetY, data, currentSceneIndex, currentMaxZIndex)
		this.screenWidgets = {
			...this.screenWidgets,
			[widgetItem.id]: widgetItem,
		}
	}
	/* 删除组件 */
	deleteWidget(id: string): void {
		this.screenWidgets[id].scene = -1
		this.screenWidgets = { ...this.screenWidgets }
	}
	/* 复制组件 */
	copyWidget(copyId: string): void {
		const widget = this.screenWidgets[copyId]
		if (!widget) return
		const newWidget = copy(widget)
		const id = uuid()
		newWidget.id = id
		const config = newWidget.config
		config.widget.id = id
		const layout = config.layout
		layout.position.left = 10 + Number(layout.position.left)
		layout.position.top = 10 + Number(layout.position.top)
		this.screenWidgets = { ...this.screenWidgets, [id]: newWidget }
	}
	/* 更新组件 */
	updateComponentTarget(id, target, value): void {
		switch (target) {
			case 'config.api.params':
				this.screenWidgets[id].config.api.params = {
					...this.screenWidgets[id].config.api.params,
					...value,
				}
				break
			case 'config.api.data':
				this.screenWidgets[id].config.api.data = value
				break
			case 'config.config':
				this.screenWidgets[id].config.config = {
					...this.screenWidgets[id].config.config,
					...value,
				}
				break
		}
	}
	/* 更新组件 */
	updateComponent(id, config): void {
		const widgetConfig = this.screenWidgets[id].config.api
		if (config.params) {
			widgetConfig.params = JSON.stringify(config.params)
		}
		if (config.data) {
			widgetConfig.data = JSON.stringify(config.data)
		}
		if (config.url) {
			widgetConfig.url = config.url
		}
		if (config.path) {
			widgetConfig.path = config.path
		}
		if (config.method) {
			widgetConfig.method = config.method
		}
	}
}
