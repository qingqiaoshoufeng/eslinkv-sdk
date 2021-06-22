import Factory from '@/core/Base/factory'
import ScreenPc from '@/core/Screen/pc'
import Scene from '@/core/Scene'
import Ruler from '@/core/ui/Ruler'
import Widget from '@/core/Widget/normal'
import Current from '@/core/Current'
import Local from '@/core/Local'
import { uuid } from '@/core/utils'
import { configMerge } from '@/core/utils'
import commonConfigValue from '@/core/common-config-value.js'
import { useList } from '@/vue2/api/marketComponent.api'

const rulerContainerId = `drag-content-${+new Date()}`
class Editor extends Factory<Editor> {
	rulerContainerId = rulerContainerId
	/* 大屏ID */
	screenId: string
	/* 大屏平台状态 是否自动贴靠参考线*/
	autoAlignGuide = true
	/* 大屏状态 inEdit  在编辑器中  inPreview 在预览中*/
	editorStatus = 'inPreview'
	/* 大屏平台状态 是否全屏*/
	fullscreen = false
	/* 组件加载状态 */
	widgetLoaded = {}
	/* 更新组件加载状态 */
	updateWidgetLoaded(key: string): void {
		this.widgetLoaded[key] = true
	}
	/* 更新大屏状态 */
	updateEditorStatus(status: string): void {
		this.editorStatus = status
	}
	screen: ScreenPc = ScreenPc.Instance()
	current: Current = Current.Instance({
		rulerContainerId,
	})
	scene: Scene = Scene.Instance()
	local: Local = Local.Instance()
	ruler: Ruler | null

	init(res?: any): any {
		let screen
		if (res) {
			this.screenId = res.screenId
			screen = this.screen.init(res)
			this.scene.init(res)
			this.loadMarketComponent(screen)
		}
		this.resetZoom()
		return { screen }
	}

	loadMarketComponent(screen: any) {
		const list = []
		const p = []
		screen.marketComponents.forEach(item => {
			if (!this.widgetLoaded[`${item.type}${item.version}`]) {
				this.updateWidgetLoaded(`${item.type}${item.version}`)
				list.push({
					componentEnTitle: item.type,
					componentVersion: item.version,
				})
			}
		})
		useList({ list }).then((res: any) => {
			res.forEach((item: any) => {
				p.push(
					new Promise(resolve => {
						const script = document.createElement('script')
						script.onload = () => {
							resolve(true)
						}
						script.src = item.componentJsUrl
						document.head.appendChild(script)
					}),
				)
			})
			Promise.all(p)
				.then(() => {
					for (const key in screen.screenWidgets) {
						if (screen.screenWidgets[key].value) {
							screen.screenWidgets[key].config = screen.screenWidgets[key].value
							delete screen.screenWidgets[key].value
						}
					}
					this.screen.screenWidgets = screen.screenWidgets
				})
				.catch(e => {
					console.error(e)
					console.error('组件初始化加载失败')
				})
		})
	}
	/* ---------------------------------------------------Ruler---------------------------------------------------*/
	createGuide(num: string | number, type: string): void {
		this.ruler.createGuide(num, type)
	}
	clearGuides(): void {
		this.ruler.clearGuides()
	}
	/* ---------------------------------------------------Local---------------------------------------------------*/
	localInit(obj: any): void {
		this.local.init(obj)
	}
	setLocalWidgets(obj: any): void {
		this.local.setLocalWidgets(obj)
	}
	/* ---------------------------------------------------Current---------------------------------------------------*/
	get currentRightSettingIndex(): number {
		return this.current.currentRightSettingIndex
	}
	selectRightSettingIndex(index: number): void {
		this.current.currentRightSettingIndex = index
	}
	get activeWidgetId(): string {
		return this.current.activeWidgetId
	}
	set activeWidgetId(val: string) {
		this.current.activeWidgetId = val
	}
	get activeSceneId(): number | string {
		return this.current.activeSceneId
	}
	set activeSceneId(val: number | string) {
		this.current.activeSceneId = val
	}
	/* 当前选中组件-多组件配置 */
	get currentWidgetListConfig(): any {
		return this.current.currentWidgetListConfig
	}
	/* 当前组件 */
	get currentWidgetId(): string {
		return this.current.currentWidgetId
	}
	get currentWidget() {
		return this.current.currentWidget
	}
	/* 当前选中组件-多组件 */
	get currentWidgetList(): any {
		return this.current.currentWidgetList
	}
	/* 选中组件 */
	selectWidget(widget: Widget): void {
		this.current.selectWidget(widget)
	}
	/* 取消选中组件 */
	unSelectWidget(): void {
		this.current.unSelectWidget()
	}
	/* 取消选中组件集合 */
	unSelectWidgetList(): void {
		this.current.unSelectWidgetList()
	}
	/* 添加到选中组件集合 */
	addWidgetList(list: Widget): void {
		this.current.addWidgetList(list)
	}
	selectWidgetList(config: any): void {
		this.current.selectWidgetList(config)
	}
	/* 当前场景 */
	get currentSceneIndex(): string | number {
		return this.current.currentSceneIndex
	}
	/* 选中场景 */
	selectSceneIndex(sceneIndex: string | number): void {
		this.current.selectSceneIndex(sceneIndex)
	}
	/* 打开场景 */
	openScene(id: string): void {
		if (this.editorStatus === 'inPreview') this.current.openScene(id)
	}
	/* 关闭场景 */
	closeScene(id: string): void {
		if (this.editorStatus === 'inPreview') this.current.closeScene(id)
	}
	get offsetX(): number {
		return this.current.offsetX
	}
	set offsetX(val: number) {
		this.current.offsetX = val
	}
	get offsetY(): number {
		return this.current.offsetY
	}
	set offsetY(val: number) {
		this.current.offsetY = val
	}
	get contentMove(): boolean {
		return this.current.contentMove
	}
	set contentMove(val: boolean) {
		this.current.contentMove = val
	}
	get widgetMove(): boolean {
		return this.current.widgetMove
	}
	set widgetMove(val: boolean) {
		this.current.widgetMove = val
	}
	get xRoomL1(): number {
		return this.current.xRoomL1
	}
	get xRoomL2(): number {
		return this.current.xRoomL2
	}
	get xRoomR1(): number {
		return this.current.xRoomR1
	}
	get yRoom(): number {
		return this.current.yRoom
	}
	get zoom(): number {
		return this.current.zoom
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
	taggerXRoomL1(): void {
		this.current.taggerXRoomL1()
	}
	taggerXRoomL2(): void {
		this.current.taggerXRoomL2()
	}
	taggerXRoomR1(): void {
		this.current.taggerXRoomR1()
	}
	/* 画布还原最佳比例 */
	resetZoom(): void {
		if (this.editorStatus === 'inEdit') {
			if (!this.ruler) this.ruler = new Ruler(rulerContainerId)
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
	/* ---------------------------------------------------Screen---------------------------------------------------*/
	get screenType(): any {
		return this.screen.screenType
	}
	get screenWidgets(): any {
		return this.screen.screenWidgets
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
				...this.sceneWidgets[this.current.currentSceneIndex],
				...obj,
			}
		}
	}
	/* 大屏名 */
	get name(): string {
		return this.screen.screenName
	}
	set name(screenName: string) {
		this.screen.screenName = screenName
	}
	/* 大屏缩略图 */
	get avatar(): string {
		return this.screen.screenAvatar
	}
	set avatar(screenAvatar: string) {
		this.screen.screenAvatar = screenAvatar
	}
	/* 大屏适配方式 full-size 充满页面 full-width 100%宽度 full-height 100%高度 */
	get layoutMode(): string {
		return this.screen.screenLayoutMode
	}
	set layoutMode(screenLayoutMode: string) {
		this.screen.screenLayoutMode = screenLayoutMode
	}
	/* 大屏宽度 */
	get width(): number {
		return this.screen.screenWidth
	}
	/* 大屏高度 */
	get height(): number {
		return this.screen.screenHeight
	}
	/* 大屏背景颜色 */
	get backgroundColor(): string {
		return this.screen.screenBackGroundColor
	}
	set backgroundColor(screenBackGroundColor: string) {
		this.screen.screenBackGroundColor = screenBackGroundColor
	}
	/* 大屏背景图片 */
	get backgroundImage(): string {
		return this.screen.screenBackGroundImage
	}
	set backgroundImage(screenBackGroundImage: string) {
		this.screen.screenBackGroundImage = screenBackGroundImage
	}
	/* 大屏首屏场景 */
	get mainScene(): string | number {
		return this.screen.screenMainScene
	}
	set mainScene(screenMainScene: string | number) {
		this.screen.screenMainScene = screenMainScene
	}
	/* 获取大屏数据 */
	screenData(): any {
		return this.screen.screenData()
	}
	/* 刷新当前组件 */
	refreshWidget(): void {
		const item = this.screen.screenWidgets[this.current.currentWidgetId]
		if (item) {
			delete this.screen.screenWidgets[this.current.currentWidgetId]
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
	/* 更新组件 */
	updateComponentTarget(id, target, value): void {
		this.screen.updateComponentTarget(id, target, value)
	}
	/* 更新组件 */
	updateComponent(id, config): void {
		this.screen.updateComponent(id, config)
	}
	/* 给组件取消打组 */
	relieveWidgetGroup(): void {
		const item = this.screen.screenWidgets[this.current.currentWidgetId]
		delete this.screen.screenWidgets[this.current.currentWidgetId]
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
				[item.id]: this.screen.screenWidgets[item.id],
			}
			delete this.screen.screenWidgets[item.id]
		})
		const id = uuid()
		const config = configMerge(
			{
				widgetType: 'group',
				widget: { id, name: '分组' },
				layout: {
					size: {
						width: this.current.currentWidgetListConfig.width,
						height: this.current.currentWidgetListConfig.height,
					},
					position: {
						left: this.current.currentWidgetListConfig.left,
						top: this.current.currentWidgetListConfig.top,
					},
				},
			},
			commonConfigValue(),
		)
		this.screen.screenWidgets[id] = {
			config,
			id,
			market: false,
			scene: this.current.currentSceneIndex,
			widgetType: 'group',
			children,
		}
		this.screen.screenWidgets = { ...this.screen.screenWidgets }
		this.current.unSelectWidget()
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
		if (id === this.currentWidgetId) this.current.unSelectWidget()
	}
	/* 复制组件 */
	copyWidget(): void {
		this.screen.copyWidget(this.current.currentWidgetId)
	}
	/* 更新大屏组件配置 */
	updateWidgetConfig(id: string, localConfigValue: any, customConfig: any): any {
		return this.screen.updateWidgetConfig(id, localConfigValue, customConfig)
	}

	/* ---------------------------------------------------Scene---------------------------------------------------*/
	/* 场景数据 */
	get sceneObj() {
		return this.scene.sceneObj
	}
	/* 获取场景数据 */
	sceneData(): any {
		return this.scene.sceneData()
	}
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
			if (this.current.currentSceneIndex == -1) {
				delete this.screen.screenWidgets[key]
			} else if (this.screen.screenWidgets[key].scene === this.current.currentSceneIndex) {
				this.screen.screenWidgets[key].scene = -1
			}
		}
		this.screen.screenWidgets = { ...this.screen.screenWidgets }
	}
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
		this.dataSettingFind(id, list, data, this.screen.screenWidgets)
	}
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!window.eslinkV) window.eslinkV = {}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.eslinkV.Editor = Editor
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default window.eslinkV.Editor
