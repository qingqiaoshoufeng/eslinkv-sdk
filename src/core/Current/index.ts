import Factory from '@/core/Base/factory'
import Widget from '@/core/Widget/normal'

export default class Current extends Factory<Current> {
	rulerContainerId: string
	xRoomL1: number = +localStorage.getItem('xRoomL1')
	xRoomL2: number = +localStorage.getItem('xRoomL2')
	xRoomR1: number = +localStorage.getItem('xRoomR1')
	yRoom = 60
	/* 被激活的场景对应组件 */
	activeWidgetId = ''
	/* 被激活的场景id */
	activeSceneId: number | string = 0
	/* 是否按下了 空格 键，启动内容区拖动 */
	contentMove = false
	/* 组件点击开始拖拽 */
	widgetMove = false
	/* 当前标尺zoom */
	zoom = 1
	/* 当前标尺zoom步长 */
	zoomStep = 0.02
	/* 当前位置x */
	offsetX = 0
	/* 当前位置y */
	offsetY = 0
	/* 当前组件 */
	currentWidgetId = ''
	currentWidget: Widget | null
	/* 当前选中组件-多组件 */
	currentWidgetList: Widget[] = []
	/* 当前场景 */
	currentSceneIndex: number | string = 0
	/* 当前打开的场景集合 */
	currentCreateSceneList = []
	/* 当前选中组件-多组件配置 */
	currentWidgetListConfig = {
		left: 0,
		top: 0,
		width: 0,
		height: 0,
		z: 0,
	}
	constructor(obj: any) {
		super()
		this.rulerContainerId = obj.rulerContainerId
	}

	taggerXRoomL1(): void {
		this.xRoomL1 = this.xRoomL1 > 0 ? 0 : 238
		localStorage.setItem('xRoomL1', `${this.xRoomL1}`)
	}
	taggerXRoomL2(): void {
		this.xRoomL2 = this.xRoomL2 > 0 ? 0 : 238
		localStorage.setItem('xRoomL2', `${this.xRoomL2}`)
	}
	taggerXRoomR1(): void {
		this.xRoomR1 = this.xRoomR1 > 0 ? 0 : 350
		localStorage.setItem('xRoomR1', `${this.xRoomR1}`)
	}
	/* 放大画布 */
	zoomIn(step = 2): void {
		this.zoom = +((this.zoom * 100 + step) / 100).toFixed(2)
	}
	/* 缩小画布 */
	zoomOut(step = 2): void {
		if (this.zoom * 100 > step) {
			this.zoom = +((this.zoom * 100 - step) / 100).toFixed(2)
		}
	}
	/* 画布还原最佳比例 */
	resetZoom({ screenWidth, screenHeight }: any = {}): void {
		const dom: HTMLElement = document.getElementById(this.rulerContainerId)
		const rulerOffsetWidth = dom.offsetWidth
		this.zoom = ~~((rulerOffsetWidth / screenWidth) * 100) / 100
		const rulerOffsetHeight = dom.offsetHeight
		this.offsetX = (rulerOffsetWidth - screenWidth) * 0.5
		this.offsetY = (rulerOffsetHeight - screenHeight) * 0.5
	}
	/* 选中组件 */
	selectWidget(widget: Widget): void {
		if (widget.config.widget.hide) {
			return
		}
		this.currentWidgetId = widget.id
		this.currentWidget = null
		this.currentWidget = widget
		this.currentWidgetList = []
	}
	/* 取消选中组件 */
	unSelectWidget(): void {
		this.currentWidgetId = ''
		this.currentWidget = null
		this.currentWidgetList = []
	}
	/* 取消选中组件集合 */
	unSelectWidgetList(): void {
		this.currentWidgetList = []
	}
	selectWidgetList(config: any): void {
		this.currentWidgetListConfig = config
	}
	/* 添加到选中组件集合 */
	addWidgetList(list: Widget): void {
		this.currentWidgetList = [...this.currentWidgetList, list]
	}
	/* 选中场景 */
	selectSceneIndex(val: number | string): void {
		if (typeof val === 'number' || val) this.currentSceneIndex = val
		let event = new CustomEvent('SceneIndex', { detail: { index: val } })
		document.dispatchEvent(event)
		event = null
	}
	/* 打开场景 */
	openScene(id: string): void {
		this.currentCreateSceneList = [...this.currentCreateSceneList, id]
	}
	/* 关闭场景 */
	closeScene(id: string): void {
		const index = this.currentCreateSceneList.findIndex(v => v === id)
		this.currentCreateSceneList.splice(index, 1)
		this.currentCreateSceneList = [...this.currentCreateSceneList]
		let event = new CustomEvent('DestroyScene', { detail: { index } })
		document.dispatchEvent(event)
		event = null
	}
}
