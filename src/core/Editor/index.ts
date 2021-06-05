import Factory from '@/core/Base/factory'
import ScreenPc from '@/core/Screen/pc'
import Scene from '@/core/Scene'
import Eve from '@/core/Eve'
import Ruler from '@/core/ui/Ruler'

const dragId = `drag-content-${+new Date()}`
const rulerContentId = `drag-content-${+new Date()}`
export default class Editor extends Factory<Editor> {
	dragId = dragId
	rulerContentId = rulerContentId
	/* 大屏ID */
	screenId: string
	private screen: ScreenPc = ScreenPc.Instance()
	private scene: Scene = Scene.Instance()
	private ruler: Ruler | null
	private eve: Eve = Eve.Instance({
		rulerContentId,
	})

	init(res: any): any {
		let screen
		if (res) {
			this.screenId = res.screenId
			screen = this.screen.init(res)
			this.scene.init(res)
		}
		this.ruler = new Ruler(rulerContentId)
		this.eve.resetZoom({
			screenHeight: this.screen.screenHeight,
			screenWidth: this.screen.screenWidth,
		})
		this.ruler.resetZoom({
			screenHeight: this.screen.screenHeight,
			screenWidth: this.screen.screenWidth,
		})
		return { screen }
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
		this.eve.resetZoom({
			screenHeight: this.screen.screenHeight,
			screenWidth: this.screen.screenWidth,
		})
		this.ruler.resetZoom({
			screenHeight: this.screen.screenHeight,
			screenWidth: this.screen.screenWidth,
		})
	}
	/* ---------------------------------------------------Screen---------------------------------------------------*/
	get screenType(): any {
		return this.screen.screenType
	}
	get screenWidgets(): any {
		return this.screen.screenWidgets
	}
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
		if (this.scene.sceneIndex === 0) {
			return this.sceneWidgets[0]
		} else {
			return [
				...(this.sceneWidgets[this.scene.sceneIndex] || []),
				...this.sceneWidgets[0],
				...this.scene.createSceneList
					.map(v => this.sceneWidgets[v])
					.flat(),
			]
		}
	}
	openScene(id) {
		this.scene.createSceneList.push(id)
		this.scene.setSceneIndex(id)
	}
	closeScene(id) {
		const index = this.scene.createSceneList.findIndex(v => v === id)
		this.scene.createSceneList.splice(index, 1)
	}
	get isMac(): any {
		return this.screen.isMac
	}
	get chooseWidgetChildId(): string {
		return this.screen.chooseWidgetChildId
	}
	get chooseWidgetArrayConfig(): any {
		return this.screen.chooseWidgetArrayConfig
	}
	get autoAlignGuide(): boolean {
		return this.screen.autoAlignGuide
	}
	get chooseWidget(): any {
		return this.screen.chooseWidget
	}
	get chooseWidgetId(): string {
		return this.screen.chooseWidgetId
	}
	get chooseWidgetArray(): any {
		return this.screen.chooseWidgetArray
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
	/* 大屏状态 inEdit  在编辑器中  inPreview 在预览中*/
	get editorStatus(): string {
		return this.screen.editorStatus
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
	/* 更新大屏状态 */
	updateEditorStatus(status: string): void {
		this.screen.updateEditorStatus(status)
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
	createWidget(e: any): void {
		this.screen.createWidget(
			e,
			this.scene.sceneIndex,
			this.sortByZIndexWidgetsList.length
				? this.sortByZIndexWidgetsList[0].value.layout.zIndex + 1
				: 10,
		)
	}
	/* 取消选中组件 */
	unChooseWidget(): void {
		this.screen.unChooseWidget()
	}
	/* 更新大屏组件配置 */
	updateWidgetConfig(id, config): void {
		this.screen.updateWidgetConfig(id, config)
	}
	/* 选中组件 */
	setChooseWidget(id: string): void {
		this.screen.setChooseWidget(id)
	}
	/* 选中组件的自定义配置更新 */
	setChooseWidgetCustomConfig(value = []): void {
		this.screen.setChooseWidgetCustomConfig(value)
	}

	/* ---------------------------------------------------Scene---------------------------------------------------*/
	/* 当前场景 */
	get sceneIndex() {
		return this.scene.sceneIndex
	}
	set sceneIndex(val) {
		this.scene.sceneIndex = val
	}
	/* 场景数据 */
	get sceneObj() {
		return this.scene.sceneObj
	}
	/* 场景数据 */
	get sceneList() {
		return this.scene.sceneList
	}
	/* 切换场景 */
	setSceneIndex(val: number | string): void {
		this.scene.setSceneIndex(val)
	}
	/* 获取场景数据 */
	sceneData(): any {
		return this.scene.sceneData()
	}
	/* 更新场景名称 */
	setSceneName(name: string): void {
		this.scene.setSceneName(name)
	}
	/* 创建场景 */
	createScene(): void {
		this.scene.createScene()
	}
	/* 删除场景 */
	destroyScene(): void {
		this.scene.destroyScene()
	}
	/* ---------------------------------------------------More---------------------------------------------------*/
	/* 获取大屏组件配置——根据zIndex排序 */
	get sortByZIndexWidgetsList(): any {
		const list = []
		for (const key in this.screen.screenWidgets) {
			const item = this.screen.screenWidgets[key]
			if (item.scene === this.scene.sceneIndex) {
				list.push(item)
			}
		}
		list.sort((a, b) => {
			return b.value.layout.zIndex - a.value.layout.zIndex - 1
		})
		return list
	}
	set sortByZIndexWidgetsList(val) {
		console.log(val)
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
