import base from './base'
import Vue from 'vue'
import { detail } from '@/api/screen.api'
import { use } from '@/api/marketComponent.api'
import { setDefault } from '@/utils'

export default class ScreenPc extends base implements ScreenV {
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
			return Vue.prototype.$screen
		}
		return Vue.prototype.$screen
	}
	/* 当前系统版本 */
	currentVersion = '1.1.0'
	/* 当前组件加载状态 */
	widgetLoaded = {}
	/* 当前组件加载状态 */
	widgetLoading = true
	/* 当前选中组件 */
	chooseWidgetId = null
	/* 当前选中组件-子组件 */
	chooseWidgetChildId: null
	/* 当前选中组件-多组件 */
	chooseWidgetArray = []
	/* 当前选中组件-自定义配置 */
	chooseWidgetCustomConfig = []
	/* 当前选中组件-多组件配置 */
	chooseWidgetArrayConfig = {
		left: 0,
		top: 0,
		width: 0,
		height: 0,
		z: 0,
	}
	/* 递归查询组件 */
	searchWidget(widget, id) {
		let res
		if (widget.children && id) {
			res = widget.children.find(v => v.id === id)
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
	/* 选中组件 */
	setChooseWidget(id) {
		this.chooseWidgetId = id
	}
	/* 选中组件的自定义配置更新 */
	setChooseWidgetCustomConfig(value = []) {
		this.chooseWidgetCustomConfig = [...value, { type: 'custom' }]
	}
	/* 取消选中组件 */
	unChooseWidget() {
		this.chooseWidgetId = null
		this.chooseWidgetChildId = null
		this.chooseWidgetArray = []
		document.getElementById('right-menu').classList.remove('active')
	}
	/* 选中的组件 */
	get chooseWidget() {
		if (!this.chooseWidgetId) return null
		const widget = this.screenWidgets[this.chooseWidgetId]
		if (widget.children && this.chooseWidgetChildId) {
			return this.searchWidget(widget, this.chooseWidgetChildId)
		}
		return widget
	}
	/* 配置序列化 */
	public serialize(res) {
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
		this.width = res.screenWidth ? res.screenWidth : res.screenConfig.width
		delete this.screenConfig.width
		this.height = res.screenHeight
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
		this.initScene(res)
		this.initWidget(res)
		this.screenId = res.screenId
	}
	/* 序列化组件数据 */
	initWidget(res) {
		let screenWidgets
		if (res.screenConfig.widgets) {
			screenWidgets = res.screenConfig.widgets
		} else {
			screenWidgets = res.screenWidgets
		}
		screenWidgets.forEach(v => setDefault(v.value))
		delete this.screenConfig.widgets
		const obj = {}
		const marketComponents: { type: string; version: string }[] = []
		const p = []
		screenWidgets.forEach(item => {
			obj[item.id] = {
				id: item.id,
				market: item.market,
				scene: item.scene,
				type: item.type,
				config: item.value,
				children: item.children,
			}
			if (item.market) {
				marketComponents.push({
					type: item.type,
					version: item.value.widget.componentVersion,
				})
			}
		})
		marketComponents.forEach(item => {
			if (this.widgetLoaded[`${item.type}${item.version}`]) return
			p.push(
				new Promise<number>((resolve, reject) => {
					use({
						componentEnTitle: item.type,
						componentVersion: item.version,
					}).then((res: widgetUseResult) => {
						const script = document.createElement('script')
						script.onload = () => {
							this.widgetLoaded[
								`${item.type}${item.version}`
							] = true
							resolve(1)
						}
						script.onerror = () => {
							reject(1)
						}
						if (res) {
							script.src = res.componentJsUrl
							document.head.appendChild(script)
						} else {
							console.error(
								`${item.type}${item.version}加载组件失败`,
							)
						}
					})
				}),
			)
		})
		Promise.all(p)
			.then(() => {
				this.widgetLoading = false
				this.screenWidgets = obj
				const widgets = Object.values(obj)
				const list = this.sceneList
				widgets.forEach((item: any) => {
					const index = list.indexOf(item.scene)
					if (index !== -1) {
						if (!this.sceneWidgets[list[index]]) {
							this.sceneWidgets[list[index]] = {}
						}
						if (!this.sceneWidgets[list[index]].list) {
							this.sceneWidgets[list[index]].list = []
						}
						this.sceneWidgets[list[index]].list.push(item)
					}
				})
			})
			.catch(() => {
				this.widgetLoading = false
				console.error('组件初始化加载失败')
			})
		if (p.length === 0) {
			this.widgetLoading = false
		}
	}

	public init(obj: any) {
		if (obj.screenId) {
			detail({ screenId: obj.screenId }).then(res => {
				this.serialize(res)
			})
		}
	}
}
