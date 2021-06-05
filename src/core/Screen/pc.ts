import ScreenBase from '@/core/Screen/base'
import { setDefault } from '@/utils'
import copy from 'fast-copy'
import { uuid } from '../../utils/index'

export default class ScreenPc extends ScreenBase {
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
	setChooseWidget(id: string): void {
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
	initWidget(res: any) {
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
		return { marketComponents, screenWidgets }
	}

	/* 复制组件 */
	copyWidget() {
		const copyId = this.chooseWidgetId
		const widget = this.screenWidgets[copyId]
		if (!widget) return
		const copiedWidget = copy(widget)
		const id = uuid()
		copiedWidget.id = id
		const config = copiedWidget.config
		config.widget.id = id
		const layout = config.layout
		layout.position.left += 10
		layout.position.top += 10
		this.screenWidgets[id] = copiedWidget
	}
}
