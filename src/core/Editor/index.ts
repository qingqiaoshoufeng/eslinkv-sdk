import Factory from '@/core/Base/factory'
import ScreenPc from '@/core/Screen/pc'
import Scene from '@/core/Scene'
import Eve from '@/core/Eve'
import Ruler from '@/core/ui/Ruler'
import Widget from '@/core/Widget/normal'
import Current from '@/core/Current'
import { uuid } from '@/core/utils'
import { configMerge } from '@/utils'
import commonConfigValue from '../../../common-config-value'

const rulerContainerId = `drag-content-${+new Date()}`
export default class Editor extends Factory<Editor> {
	rulerContainerId = rulerContainerId
	/* 大屏ID */
	screenId: string
	/* 大屏状态 inEdit  在编辑器中  inPreview 在预览中*/
	editorStatus = 'inPreview'
	/* 更新大屏状态 */
	updateEditorStatus(status: string): void {
		this.editorStatus = status
	}
	screen: ScreenPc = ScreenPc.Instance()
	current: Current = Current.Instance()
	scene: Scene = Scene.Instance()
	ruler: Ruler | null
	eve: Eve = Eve.Instance({
		rulerContainerId,
	})

	init(res?: any): any {
		let screen
		if (res) {
			this.screenId = res.screenId
			screen = this.screen.init(res)
			this.scene.init(res)
		}
		this.resetZoom()
		return { screen }
	}
	/* ---------------------------------------------------Current---------------------------------------------------*/
	/* 当前选中组件-多组件配置 */
	get currentWidgetListConfig(): any {
		return this.current.currentWidgetListConfig
	}
	/* 当前组件 */
	get currentWidgetId(): string {
		return this.current.currentWidgetId
	}
	get currentWidget(): Widget | null {
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

	/* ---------------------------------------------------Eve---------------------------------------------------*/
	get xRoomL1(): number {
		return this.eve.xRoomL1
	}
	get xRoomL2(): number {
		return this.eve.xRoomL2
	}
	get xRoomR1(): number {
		return this.eve.xRoomR1
	}
	get yRoom(): number {
		return this.eve.yRoom
	}
	get clientX(): number {
		return this.eve.clientX
	}
	get clientY(): number {
		return this.eve.clientY
	}
	get zoom(): number {
		return this.eve.zoom
	}
	/* 放大画布 */
	zoomIn(step = 2): void {
		this.eve.zoomIn(step)
		this.ruler.draw({
			zoom: this.eve.zoom,
		})
	}
	/* 缩小画布 */
	zoomOut(step = 2): void {
		this.eve.zoomOut(step)
		this.ruler.draw({
			zoom: this.eve.zoom,
		})
	}
	taggerXRoomL1(): void {
		this.eve.taggerXRoomL1()
	}
	taggerXRoomL2(): void {
		this.eve.taggerXRoomL2()
	}
	taggerXRoomR1(): void {
		this.eve.taggerXRoomR1()
	}
	/* 画布还原最佳比例 */
	resetZoom(): void {
		if (this.editorStatus === 'inEdit') {
			if (!this.ruler) this.ruler = new Ruler(rulerContainerId)
			this.ruler.resetZoom({
				screenHeight: this.screen.screenHeight,
				screenWidth: this.screen.screenWidth,
			})
			this.eve.resetZoom({
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
		const res = { 0: [] }
		for (const widgetId in this.screenWidgets) {
			if (!res[this.screenWidgets[widgetId].scene])
				res[this.screenWidgets[widgetId].scene] = []
			res[this.screenWidgets[widgetId].scene].push(
				this.screenWidgets[widgetId],
			)
		}
		return res
	}
	get showWidgets() {
		if (this.current.currentSceneIndex === 0) {
			return [
				...this.sceneWidgets[0],
				...this.current.currentCreateSceneList
					.map(v => this.sceneWidgets[v])
					.flat(),
			]
		} else {
			return [
				...(this.sceneWidgets[this.current.currentSceneIndex] || []),
				...this.sceneWidgets[0],
				...this.current.currentCreateSceneList
					.map(v => this.sceneWidgets[v])
					.flat(),
			]
		}
	}
	get isMac(): any {
		return this.screen.isMac
	}
	get autoAlignGuide(): boolean {
		return this.screen.autoAlignGuide
	}
	get fullscreen(): boolean {
		return this.screen.fullscreen
	}
	set fullscreen(val: boolean) {
		this.screen.fullscreen = val
	}
	get widgetLoaded(): any {
		return this.screen.widgetLoaded
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
	/* 更新组件加载状态 */
	updateWidgetLoaded(key: string): void {
		this.screen.widgetLoaded[key] = true
	}
	/* 获取大屏数据 */
	screenData(): any {
		return this.screen.screenData()
	}
	/* 添加组件 */
	createWidget(offsetX: number, offsetY: number, data: any): void {
		const currentMaxZIndex = this.sortByZIndexWidgetsList.length
			? this.sortByZIndexWidgetsList[0].config.layout.zIndex + 1
			: 10
		this.screen.createWidget(
			offsetX,
			offsetY,
			data,
			this.current.currentSceneIndex,
			currentMaxZIndex,
		)
	}
	createWidgetGroup(): void {
		const children = []
		this.current.currentWidgetList.map(item => {
			children.push(this.screen.screenWidgets[item.id])
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
		this.current.unSelectWidget()
	}
	deleteWidgets(): void {
		this.currentWidgetList.map(item => {
			delete this.screen.screenWidgets[item.id]
		})
		this.current.unSelectWidget()
		this.screen.screenWidgets = { ...this.screen.screenWidgets }
	}
	/* 删除组件 */
	deleteWidget(id: string): void {
		if (id) this.screen.deleteWidget(id)
		if (id === this.currentWidgetId) this.current.unSelectWidget()
	}
	copyWidget(): void {
		this.screen.copyWidget(this.current.currentWidgetId)
	}
	/* 更新大屏组件配置 */
	updateWidgetConfig(
		id: string,
		localConfigValue: any,
		customConfig: any,
	): any {
		return this.screen.updateWidgetConfig(
			id,
			localConfigValue,
			customConfig,
		)
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
			if (
				this.screen.screenWidgets[key].scene ===
				this.current.currentSceneIndex
			) {
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
			transform: `translate3d(${this.eve.offsetX}px, ${this.eve.offsetY}px, 0) scale(${this.eve.zoom})`,
			width: `${this.width + 18 * 2}px`,
			height: `${this.height + 18 * 2}px`,
		}
	}
	screenSizeChange({ width, height }: any = {}): void {
		if (width) this.screen.screenWidth = width
		if (height) this.screen.screenHeight = height
		this.resetZoom()
	}
}
