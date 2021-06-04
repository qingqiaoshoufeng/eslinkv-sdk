import Factory from '@/core/Base/factory'
import ScreenPc from '@/core/Screen/pc'
import Scene from '@/core/Scene'
import { Message } from 'view-design'
import { debounce } from 'throttle-debounce'
import { update } from '@/api/screen.api'
import Eve from '@/core/Eve'
import Ruler from '@/core/ui/Ruler'

const dragId = `drag-content-${+new Date()}`
const contentId = `drag-content-${+new Date()}`
export default class Editor extends Factory<Editor> {
	dragId = dragId
	contentId = contentId
	/* 大屏ID */
	screenId: string
	private screen: ScreenPc = ScreenPc.Instance()
	private scene: Scene = Scene.Instance()
	private ruler: Ruler | null
	private eve: Eve = Eve.Instance({
		contentId,
	})

	public init(res: any): any {
		if (res) {
			this.screenId = res.screenId
			const screen = this.screen.init(res)
			this.scene.init(res)
			return { screen }
		}
		this.ruler = new Ruler()
		this.eve.resetZoom({
			screenHeight: this.screen.screenHeight,
			screenWidth: this.screen.screenWidth,
		})
		this.ruler.resetZoom({
			screenHeight: this.screen.screenHeight,
			screenWidth: this.screen.screenWidth,
		})
	}
	/* ---------------------------------------------------Eve---------------------------------------------------*/
	get guideLines(): any {
		return this.eve.guideLines
	}
	get guideVisible(): boolean {
		return this.eve.guideVisible
	}
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
	public zoomIn(step = 2): void {
		this.eve.zoomIn(step)
	}
	/* 缩小画布 */
	public zoomOut(step = 2): void {
		this.eve.zoomOut(step)
	}
	public taggerXRoomL1(): void {
		this.eve.taggerXRoomL1()
	}
	public taggerXRoomL2(): void {
		this.eve.taggerXRoomL2()
	}
	public taggerXRoomR1(): void {
		this.eve.taggerXRoomR1()
	}
	/* 画布还原最佳比例 */
	public resetZoom(): void {
		this.eve.resetZoom({
			screenHeight: this.screen.screenHeight,
			screenWidth: this.screen.screenWidth,
		})
		this.ruler.resetZoom({
			screenHeight: this.screen.screenHeight,
			screenWidth: this.screen.screenWidth,
		})
	}
	/* 创建参考线/更新参考线 */
	public createGuideLine(type: string): any {
		return this.eve.createGuideLine(type)
	}
	/* ---------------------------------------------------Screen---------------------------------------------------*/
	get screenType(): any {
		return this.screen.screenType
	}
	get screenWidgets(): any {
		return this.screen.screenWidgets
	}
	get sceneWidgets () {
		const res = { 0: [] }
		for (const widgetId in this.screenWidgets) {
			if (!res[this.screenWidgets[widgetId].scene]) res[this.screenWidgets[widgetId].scene] = []
			res[this.screenWidgets[widgetId].scene].push(this.screenWidgets[widgetId])
		}
		return res
	}
	get showWidgets () {
		if (this.scene.sceneIndex === 0) {
			return this.sceneWidgets[0]
		} else {
			return [
				...(this.sceneWidgets[this.scene.sceneIndex] || []),
				...this.sceneWidgets[0],
				...this.scene.createSceneList.map(v => this.sceneWidgets[v]).flat()
			]
		}
	}
	openScene (id) {
		this.scene.createSceneList.push(id)
		this.scene.setSceneIndex(id)
	}
	closeScene (id) {
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
	/* 选中组件 */
	public setChooseWidget(id: string): void {
		this.screen.setChooseWidget(id)
	}
	/* 选中组件的自定义配置更新 */
	public setChooseWidgetCustomConfig(value = []): void {
		this.screen.setChooseWidgetCustomConfig(value)
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
	get sortByZIndexWidgetsList(): any {
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
	get rulerStyle(): any {
		return {
			transform: `translate3d(${this.eve.offsetX}px, ${this.eve.offsetY}px, 0) scale(${this.eve.zoom})`,
			width: `${this.width + 18 * 2}px`,
			height: `${this.height + 18 * 2}px`,
		}
	}
	public screenSizeChange({ width, height }): void {
		if (width) this.screen.screenWidth = width
		if (height) this.screen.screenHeight = height
		this.resetZoom()
	}
}
