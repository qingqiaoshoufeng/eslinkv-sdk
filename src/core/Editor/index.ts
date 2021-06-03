import Factory from '@/core/Base/factory'
import Ruler from '@/core/Ruler'
import ScreenPc from '@/core/Screen/pc'
import Scene from '@/core/Scene'
import { Message } from 'view-design'
import { debounce } from 'throttle-debounce'
import { update } from '@/api/screen.api'

export default class Editor extends Factory<Editor> {
	private ruler: Ruler = Ruler.Instance()
	private screen: ScreenPc = ScreenPc.Instance()
	private scene: Scene = Scene.Instance()

	/* 大屏ID */
	public screenId: string

	public init(res: any): any {
		this.screenId = res.screenId
		const screen = this.screen.init(res)
		this.scene.init(res)
		return { screen }
	}

	/* ---------------------------------------------------Ruler---------------------------------------------------*/
	get guideStartX(): number {
		return this.ruler.guideStartX
	}
	get guideStartY(): number {
		return this.ruler.guideStartY
	}
	get rulerSize(): number {
		return this.ruler.rulerSize
	}
	get xRoomL1(): number {
		return this.ruler.xRoomL1
	}
	get xRoomL2(): number {
		return this.ruler.xRoomL2
	}
	get xRoomR1(): number {
		return this.ruler.xRoomR1
	}
	get yRoom(): number {
		return this.ruler.yRoom
	}
	get zoom(): number {
		return this.ruler.zoom
	}
	public taggerXRoomL1(): void {
		this.ruler.taggerXRoomL1()
	}
	public taggerXRoomL2(): void {
		this.ruler.taggerXRoomL2()
	}
	public taggerXRoomR1(): void {
		this.ruler.taggerXRoomR1()
	}
	/* ajax 更新参考线 */
	public updateRuler(screenId: string): void {
		if (screenId) this.ruler.updateRuler(screenId)
	}
	/* 创建参考线/更新参考线 */
	public createGuideLine(type: string, screenId: string): void {
		if (type) this.ruler.createGuideLine(type, screenId)
	}
	/* 开始拖动参考线 */
	public dragGuideLine(e: any, item: any): void {
		this.ruler.dragGuideLine(e, item)
	}
	/* 上下左右滚动画布 */
	public wheelRulerContentPosition(e: any): void {
		this.ruler.wheelRulerContentPosition(e)
	}
	/* 缩放滚动画布 */
	public wheelRulerContentZoom(e: any): void {
		this.ruler.wheelRulerContentZoom(e)
	}
	/* 放大画布 */
	public zoomIn(step = 2): void {
		this.ruler.zoomIn(step)
	}
	/* 缩小画布 */
	public zoomOut(step = 2): void {
		this.ruler.zoomOut(step)
	}
	/* 画布还原最佳比例 */
	public resetZoom(): void {
		const rulerContent = document.getElementById('ruler-content')
		const rulerOffsetWidth = rulerContent.offsetWidth - this.rulerSize
		const rulerOffsetHeight = rulerContent.offsetHeight
		this.ruler.zoom =
			~~((rulerOffsetWidth / this.width) * 100) / 100 ||
			this.ruler.zoomStep
		const deltaX = (rulerOffsetWidth - this.width) * 0.5
		const deltaY = (rulerOffsetHeight - this.height) * 0.5
		this.ruler.contentX = Math.ceil(deltaX)
		this.ruler.contentY = Math.ceil(deltaY)
	}
	
	public initX(el = '') {
		this.ruler.initX({
			el,
			width: this.width
		})
	}
	
	public initY(el = '') {
		this.ruler.initY({
			el,
			height: this.height
		})
	}

	/* ---------------------------------------------------Screen---------------------------------------------------*/
	get screenWidgets(): any {
		return this.screen.screenWidgets
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
		this.updateScreenDebounce({ screenName })
	}
	/* 大屏缩略图 */
	get avatar(): string {
		return this.screen.screenAvatar
	}
	set avatar(screenAvatar: string) {
		this.screen.screenAvatar = screenAvatar
		this.updateScreenDebounce({ screenAvatar })
	}
	/* 大屏适配方式 full-size 充满页面 full-width 100%宽度 full-height 100%高度 */
	get layoutMode(): string {
		return this.screen.screenLayoutMode
	}
	set layoutMode(screenLayoutMode: string) {
		this.screen.screenLayoutMode = screenLayoutMode
		this.updateScreenDebounce({ screenLayoutMode })
	}
	/* 大屏宽度 */
	get width(): number {
		return this.screen.screenWidth
	}
	set width(screenWidth: number) {
		this.screen.screenWidth = screenWidth
		this.updateScreenDebounce({ screenWidth })
	}
	/* 大屏高度 */
	get height(): number {
		return this.screen.screenHeight
	}
	set height(screenHeight: number) {
		this.screen.screenHeight = screenHeight
		if (this.screenId) this.updateScreenDebounce({ screenHeight })
	}
	/* 大屏背景颜色 */
	get backgroundColor(): string {
		return this.screen.screenBackGroundColor
	}
	set backgroundColor(screenBackGroundColor: string) {
		this.screen.screenBackGroundColor = screenBackGroundColor
		this.updateScreenDebounce({ screenBackGroundColor })
	}
	/* 大屏背景图片 */
	get backgroundImage(): string {
		return this.screen.screenBackGroundImage
	}
	set backgroundImage(screenBackGroundImage: string) {
		this.screen.screenBackGroundImage = screenBackGroundImage
		this.updateScreenDebounce({ screenBackGroundImage })
	}
	/* 大屏首屏场景 */
	get mainScene(): string | number {
		return this.screen.screenMainScene
	}
	set mainScene(screenMainScene: string | number) {
		this.screen.screenMainScene = screenMainScene
		this.updateScreenDebounce({ screenMainScene })
	}
	/* 更新大屏状态 */
	public updateEditorStatus(status: string): void {
		this.screen.updateEditorStatus(status)
	}
	/* 更新组件加载状态 */
	public updateWidgetLoaded(key: string): void {
		this.screen.widgetLoaded[key] = true
	}
	/* 获取大屏数据 */
	public screenData(): any {
		return this.screen.screenData()
	}
	/* 添加组件 */
	public createWidget(e: any): void {
		this.screen.createWidget(
			e,
			this.scene.sceneIndex,
			this.sortByZIndexWidgetsList.length
				? this.sortByZIndexWidgetsList[0].config.layout.zIndex + 1
				: 10,
		)
	}
	/* 取消选中组件 */
	public unChooseWidget(): void {
		this.screen.unChooseWidget()
	}
	/* 更新大屏组件配置 */
	public updateWidgetConfig(id, config): void {
		this.screen.updateWidgetConfig(id, config)
	}
	/* 更新大屏信息 防抖：1500ms */
	updateScreenDebounce = debounce(1500, false, function (obj: any): void {
		if (this.screenId) {
			update({
				screenId: this.screenId,
				...obj,
			}).then(() => {
				Message.success('修改成功')
			})
		}
	})

	/* ---------------------------------------------------Scene---------------------------------------------------*/
	/* 当前场景 */
	get sceneIndex() {
		return this.scene.sceneIndex
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
	public setSceneIndex(val: number | string): void {
		this.scene.setSceneIndex(val)
	}
	/* 获取场景数据 */
	public sceneData(): any {
		return this.scene.sceneData()
	}
	/* 更新场景名称 */
	public setSceneName(name: string): void {
		this.scene.setSceneName(name)
	}
	/* 创建场景 */
	public createScene(): void {
		this.scene.createScene()
	}
	/* 删除场景 */
	public destroyScene(): void {
		this.scene.destroyScene()
	}
	/* ---------------------------------------------------More---------------------------------------------------*/
	/* 获取大屏组件配置——根据zIndex排序 */
	get sortByZIndexWidgetsList() {
		const list = []
		for (const key in this.screen.screenWidgets) {
			const item = this.screen.screenWidgets[key]
			if (item.scene === this.scene.sceneIndex) {
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
}
