import Ruler from '@/core/ui/Ruler'
import { uuid } from '@/core/utils'
import { useList } from '@/vue2/api/marketComponent.api'
import Agent from '@/core/Editor/agent'
import HttpTask from '@/core/Http/task'
import { usePath, useProcess } from '@/vue2/utils'
import Widget from '@/core/Widget/normal'

class Editor extends Agent {
	init(res?: any): any {
		let screen
		if (res) {
			if (res.screenId) this.screenId = res.screenId
			screen = this.screen.init(res)
			this.scene.init(res)
			this.loadMarketComponent(screen)
		}
		this.resetZoom()
		return { screen }
	}

	clear(): void {
		this.screen.clear()
		this.current.clear()
		this.scene.clear()
	}

	loadMarketComponent(screen: any) {
		const list = []
		const p = []
		this.screen.marketComponents.forEach(item => {
			if (!this.widgetLoaded[`${item.type}${item.version}`]) {
				this.updateWidgetLoaded(`${item.type}${item.version}`)
				list.push({
					componentEnTitle: item.type,
					componentVersion: item.version,
				})
			}
		})
		if (list.length > 0) {
			this.marketComponentLoading = true
			useList({ list }).then((res: any) => {
				res.forEach((item: any, index: number) => {
					p.push(
						new Promise(resolve => {
							if (item) {
								const script = document.createElement('script')
								script.onload = () => {
									resolve(true)
								}
								script.src = item.componentJsUrl
								document.head.appendChild(script)
							} else {
								resolve(true)
								console.error(list[index])
								console.error('组件初始化加载失败')
							}
						}),
					)
				})
				Promise.all(p).then(() => {
					for (const key in screen.screenWidgets) {
						if (screen.screenWidgets[key].value) {
							screen.screenWidgets[key].config = screen.screenWidgets[key].value
							delete screen.screenWidgets[key].value
						}
					}
					this.screen.screenWidgets = screen.screenWidgets
					this.marketComponentLoading = false
				})
			})
		} else {
			this.screen.screenWidgets = screen.screenWidgets
		}
	}
	/* 放大画布 */
	zoomIn(step = 2): void {
		this.current.zoomIn(step)
		this.ruler.draw({
			zoom: this.current.zoom,
		})
	}
	/* 缩小画布 */
	zoomOut(step = 2): void {
		this.current.zoomOut(step)
		this.ruler.draw({
			zoom: this.current.zoom,
		})
	}
	/* 画布还原最佳比例 */
	resetZoom(): void {
		if (this.editorStatus === 'inEdit') {
			if (!this.ruler) this.ruler = new Ruler(this.rulerContainerId)
			this.ruler.resetZoom({
				screenHeight: this.screen.screenHeight,
				screenWidth: this.screen.screenWidth,
			})
			this.current.resetZoom({
				screenHeight: this.screen.screenHeight,
				screenWidth: this.screen.screenWidth,
			})
		}
	}
	/* 大屏场景组件关联 */
	get sceneWidgets() {
		const res = { 0: {} }
		for (const widgetId in this.screenWidgets) {
			if (!res[this.screenWidgets[widgetId].scene]) res[this.screenWidgets[widgetId].scene] = {}
			res[this.screenWidgets[widgetId].scene][widgetId] = this.screenWidgets[widgetId]
		}
		return res
	}
	get showWidgets() {
		if (this.current.currentSceneIndex === 0) {
			return {
				...this.sceneWidgets[0],
			}
		} else {
			let obj = {}
			this.current.currentCreateSceneList.map(v => {
				obj = { ...obj, ...this.sceneWidgets[v] }
			})
			return {
				...this.sceneWidgets[0],
				...this.sceneWidgets[this.current.currentSceneIndex],
				...obj,
			}
		}
	}
	/* 刷新当前组件 */
	refreshWidget(): void {
		const item = this.screen.screenWidgets[this.current.currentWidgetList[0]]
		if (item) {
			delete this.screen.screenWidgets[this.current.currentWidgetList[0]]
			this.screen.screenWidgets = { ...this.screen.screenWidgets }
			setTimeout(() => {
				this.screen.screenWidgets[item.id] = item
				this.screen.screenWidgets = { ...this.screen.screenWidgets }
			})
		}
	}
	get currentMaxZIndex(): number {
		return this.sortByZIndexWidgetsList.length ? this.sortByZIndexWidgetsList[0].config.layout.zIndex + 1 : 10
	}
	get currentMinZIndex(): number {
		return this.sortByZIndexWidgetsList.length
			? this.sortByZIndexWidgetsList[this.sortByZIndexWidgetsList.length - 1].config.layout.zIndex - 1
			: 10
	}
	/* 添加组件 */
	createWidget(offsetX: number, offsetY: number, data: any): void {
		this.screen.createWidget(offsetX, offsetY, data, this.current.currentSceneIndex, this.currentMaxZIndex)
	}
	/* 给组件取消打组 */
	relieveWidgetGroup(): void {
		const item = this.screen.screenWidgets[this.current.currentWidgetList[0]]
		delete this.screen.screenWidgets[this.current.currentWidgetList[0]]
		for (const key in item.children) {
			this.screen.screenWidgets[key] = item.children[key]
		}
		this.screen.screenWidgets = { ...this.screen.screenWidgets }
	}
	/* 给组件打组 */
	createWidgetGroup(): void {
		let children = {}
		this.current.currentWidgetList.map(item => {
			children = {
				...children,
				[item]: this.screen.screenWidgets[item],
			}
			delete this.screen.screenWidgets[item]
		})
		const offsetX = this.current.currentWidgetListConfig.left
		const offsetY = this.current.currentWidgetListConfig.top
		const width = this.current.currentWidgetListConfig.width
		const height = this.current.currentWidgetListConfig.height
		const widgetType = 'group'
		const name = '分组'
		const widgetItem = new Widget(
			offsetX,
			offsetY,
			{ width, height, children, widgetType, name, startX: 0, startY: 0 },
			this.current.currentSceneIndex,
		)
		this.screen.screenWidgets = {
			...this.screen.screenWidgets,
			[widgetItem.id]: widgetItem,
		}
		this.current.unSelectWidget()
		this.current.selectWidget(widgetItem)
	}
	/* 删除多个组件 */
	deleteWidgets(): void {
		this.currentWidgetList.map(item => {
			this.screen.screenWidgets[item.id].scene = -1
		})
		this.current.unSelectWidget()
		this.screen.screenWidgets = { ...this.screen.screenWidgets }
	}
	/* 删除组件 */
	deleteWidget(id: string): void {
		if (this.current.currentSceneIndex === -1) {
			delete this.screen.screenWidgets[id]
			this.screen.screenWidgets = { ...this.screen.screenWidgets }
		} else {
			if (id) this.screen.deleteWidget(id)
		}
		if (id === this.currentWidgetList[0]) this.current.unSelectWidget()
	}
	/* 复制组件 */
	copyWidget(): void {
		this.screen.copyWidget(this.current.currentWidgetList[0])
	}
	/* 更新大屏组件配置 */
	updateWidgetConfig(id: string, localConfigValue: any, customConfig: any): any {
		return this.screen.updateWidgetConfig(id, localConfigValue, customConfig)
	}

	/* ---------------------------------------------------Scene---------------------------------------------------*/
	/* 更新场景名称 */
	setSceneName(name: string): void {
		this.scene.setSceneName(this.current.currentSceneIndex, name)
	}
	/* 创建场景 */
	createScene(): void {
		const name = uuid()
		this.scene.createScene(name)
		this.current.selectSceneIndex(name)
	}
	/* 删除场景 */
	destroyScene(): void {
		if (this.current.currentSceneIndex !== 0) {
			this.moveWaitingDeleteRoom()
			this.scene.destroyScene(this.current.currentSceneIndex)
			this.current.selectSceneIndex(0)
			this.scene.sceneObj = { ...this.scene.sceneObj }
		}
	}
	/* ---------------------------------------------------More---------------------------------------------------*/
	moveWaitingDeleteRoom(): void {
		for (const key in this.screen.screenWidgets) {
			if (this.screen.screenWidgets[key].scene === this.current.currentSceneIndex) {
				this.screen.screenWidgets[key].scene = -1
			}
		}
		this.screen.screenWidgets = { ...this.screen.screenWidgets }
	}

	/* 获取大屏组件配置——根据zIndex排序 */
	get sortByZIndexWidgetsList(): any {
		const list = []
		for (const key in this.screen.screenWidgets) {
			const item = this.screen.screenWidgets[key]
			if (item.scene === this.current.currentSceneIndex) {
				list.push(item)
			}
		}
		list.sort((a, b) => {
			return b.config.layout.zIndex - a.config.layout.zIndex - 1
		})
		return list
	}
	get rulerStyle(): any {
		return {
			transform: `translate3d(${this.current.offsetX}px, ${this.current.offsetY}px, 0) scale(${this.current.zoom})`,
			width: `${this.width + 18 * 2}px`,
			height: `${this.height + 18 * 2}px`,
		}
	}
	screenSizeChange({ width, height }: any = {}): void {
		if (width) this.screen.screenWidth = width
		if (height) this.screen.screenHeight = height
		this.resetZoom()
	}
	/* 清除当前场景的组件 */
	clearWidgetByCurrentScene(): void {
		for (const key in this.screen.screenWidgets) {
			if (
				this.current.currentSceneIndex == -1 &&
				this.screen.screenWidgets[key].scene === this.current.currentSceneIndex
			) {
				delete this.screen.screenWidgets[key]
			} else if (this.screen.screenWidgets[key].scene === this.current.currentSceneIndex) {
				this.screen.screenWidgets[key].scene = -1
			}
		}
		this.screen.screenWidgets = { ...this.screen.screenWidgets }
	}

	/**
	 * @description 预置事件初始化
	 */
	setCustomEventConfig(id: string, val): void {
		if (val && val.length) {
			this.setCustomEventConfigFind(id, val, this.screen.screenWidgets)
		}
	}
	private setCustomEventConfigFind(id: string, val, parent) {
		for (const key in parent) {
			if (id === parent[key].id) {
				parent[key].customEventsConfig = val
			} else if (parent[key].children) {
				this.setCustomEventConfigFind(id, val, parent[key].children)
			}
		}
	}
	/**
	 * @description 自定义过滤初始化
	 */
	private dataSettingFind(id: string, list, data, parent) {
		for (const key in parent) {
			if (id === parent[key].id) {
				if (list.length) parent[key].settingDataHandle = list
				if (parent[key].settingData) {
					if (data && Object.keys(parent[key].settingData).length <= 0) parent[key].settingData = data
				}
				this.screen.screenWidgets = { ...this.screen.screenWidgets }
			} else if (parent[key].children) {
				this.dataSettingFind(id, list, data, parent[key].children)
			}
		}
	}
	dataSetting(id: string, list, data): void {
		if (list && list.length) {
			this.dataSettingFind(id, list, data, this.screen.screenWidgets)
		}
	}
	/**
	 * @description 触发事件初始化
	 */
	private eventTypesSettingFind(id: string, eventTypes: { key: string; label: string }[], parent) {
		for (const key in parent) {
			if (id === parent[key].id) {
				if (eventTypes.length) {
					parent[key].eventTypes = eventTypes
					if (!parent[key].events) parent[key].events = {}
					eventTypes.forEach(item => {
						if (!parent[key].events[item['key']]) parent[key].events[item['key']] = []
					})
				}
			} else if (parent[key].children) {
				this.eventTypesSettingFind(id, eventTypes, parent[key].children)
			}
		}
	}
	eventTypesSetting(id: string, eventTypes: { key: string; label: string }[]) {
		if (eventTypes && eventTypes.length) {
			const obj = JSON.parse(JSON.stringify(this.screen.screenWidgets))
			if (eventTypes) this.eventTypesSettingFind(id, eventTypes, obj)
			this.screen.screenWidgets[id] = obj[id]
		}
	}
	request(method: string, url: string, params: any, id) {
		const path = this.screenWidgets[id].config.api.path
		const process = this.screenWidgets[id].config.api.process
		const loopTime = this.screenWidgets[id].config.api.autoFetch.enable
			? this.screenWidgets[id].config.api.autoFetch.duration
			: 0
		this.http.screenDomain = this.screen.screenDomain
		this.http.screenHeaders = this.screen.screenHeaders
		this.http.pushOne(
			new HttpTask(method, url, params, loopTime)
				.then(res => {
					let response = usePath(path, res)
					response = useProcess(process, response)
					if (response !== undefined) this.screenWidgets[id].config.api.data = response
				})
				.catch(e => {
					console.warn(`${url}接口请求失败`, e)
				}),
			id,
		)
	}
	/* 添加到选中组件集合 */
	selectWidget(widget: Widget) {
		this.current.selectWidget(widget)
		if (this.currentWidgetList.length > 1) {
			this.updateCurrentWidgetListConfig()
		}
	}

	updateCurrentWidgetListConfig(): void {
		let minLeft = null,
			maxLeft = null,
			width = 0,
			height = 0,
			minTop = null,
			maxTop = null,
			zIndex = 10
		this.currentWidgetList.map(item => {
			const m = this.screen.screenWidgets[item]
			zIndex = m.config.layout.zIndex
			if (minLeft === null) {
				minLeft = m.config.layout.position.left
			}
			if (maxLeft === null) {
				maxLeft = m.config.layout.position.left
				width = m.config.layout.size.width
			}
			if (minTop === null) {
				minTop = m.config.layout.position.top
			}
			if (maxTop === null) {
				maxTop = m.config.layout.position.top
				height = m.config.layout.size.height
			}
			if (minLeft > m.config.layout.position.left) minLeft = m.config.layout.position.left
			if (maxLeft < m.config.layout.position.left) {
				maxLeft = m.config.layout.position.left
				width = m.config.layout.size.width
			}
			if (minTop > m.config.layout.position.top) minTop = m.config.layout.position.top
			if (maxTop < m.config.layout.position.top) {
				maxTop = m.config.layout.position.top
				height = m.config.layout.size.height
			}
		})
		this.selectWidgetList({
			left: minLeft,
			top: minTop,
			width: width + (maxLeft - minLeft),
			height: height + (maxTop - minTop),
			z: zIndex,
		})
	}
}

if (!window.eslinkV) window.eslinkV = {}
window.eslinkV.Editor = Editor
export default window.eslinkV.Editor
