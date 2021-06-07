import Factory from '@/core/Base/factory'

export default class Eve extends Factory<Screen> {
	rulerContainerId: string
	xRoomL1: number = +localStorage.getItem('xRoomL1')
	xRoomL2: number = +localStorage.getItem('xRoomL2')
	xRoomR1: number = +localStorage.getItem('xRoomR1')
	yRoom = 60
	startPointerX = 0
	startPointerY = 0
	startX = 0
	startY = 0
	clientX = 0
	clientY = 0
	/* 是否按下了 空格 键，启动内容区拖动 */
	contentMove = false
	/* 是否按下了 空格 键，之后按下了左键 */
	contentDrag = false
	/* 组件点击开始拖拽 */
	widgetMove = false
	/* 组件拖拽中 */
	widgetDrag = false
	kuangMove = false
	/* 滚动左右距离 */
	contentScrollLeft = 0
	/* 滚动上下距离 */
	contentScrollTop = 0
	/* 当前标尺zoom */
	private _zoom = 1
	/* 当前标尺zoom步长 */
	zoomStep = 0.02
	/* 当前位置x */
	offsetX = 0
	/* 当前位置y */
	offsetY = 0

	constructor(obj: any) {
		super()
		this.rulerContainerId = obj.rulerContainerId
	}

	get zoom(): number {
		return this._zoom
	}
	set zoom(val: number) {
		this._zoom = val
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
		const dom: HTMLElement = document.getElementsByClassName(
			'd-ruler-wrapper',
		)[0] as HTMLElement
		const rulerOffsetWidth = dom.offsetWidth
		this.zoom = ~~((rulerOffsetWidth / screenWidth) * 100) / 100
		const rulerOffsetHeight = dom.offsetHeight
		this.offsetX = (rulerOffsetWidth - screenWidth) * 0.5
		this.offsetY = (rulerOffsetHeight - screenHeight) * 0.5
	}
}
