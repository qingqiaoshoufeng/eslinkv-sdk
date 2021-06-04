import Factory from '@/core/Base/factory'

export default class Eve extends Factory<Screen> {
	contentId: string
	xRoomL1: number = +localStorage.getItem('xRoomL1')
	xRoomL2: number = +localStorage.getItem('xRoomL2')
	xRoomR1: number = +localStorage.getItem('xRoomR1')
	yRoom = 60
	startX = 0
	startY = 0
	clientX = 0
	clientY = 0
	/* 参考线可见 */
	guideVisible = true
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
		this.contentId = obj.contentId
	}

	get zoom(): number {
		return this._zoom
	}
	set zoom(val: number) {
		this._zoom = val
	}
	public taggerXRoomL1(): void {
		this.xRoomL1 = this.xRoomL1 > 0 ? 0 : 238
		localStorage.setItem('xRoomL1', `${this.xRoomL1}`)
	}
	public taggerXRoomL2(): void {
		this.xRoomL2 = this.xRoomL2 > 0 ? 0 : 238
		localStorage.setItem('xRoomL2', `${this.xRoomL2}`)
	}
	public taggerXRoomR1(): void {
		this.xRoomR1 = this.xRoomR1 > 0 ? 0 : 350
		localStorage.setItem('xRoomR1', `${this.xRoomR1}`)
	}
	/* 放大画布 */
	public zoomIn(step = 2): void {
		this.zoom = +((this.zoom * 100 + step) / 100).toFixed(2)
	}
	/* 缩小画布 */
	public zoomOut(step = 2): void {
		if (this.zoom * 100 > step) {
			this.zoom = +((this.zoom * 100 - step) / 100).toFixed(2)
		}
	}
	/* 画布还原最佳比例 */
	public resetZoom({ screenWidth, screenHeight }: any = {}): void {
		const dom = document.getElementsByClassName('d-ruler-wrapper')[0]
		const rulerOffsetWidth = dom.offsetWidth
		this.zoom = ~~((rulerOffsetWidth / screenWidth) * 100) / 100
		const rulerOffsetHeight = dom.offsetHeight
		const deltaX = (rulerOffsetWidth - screenWidth) * 0.5
		const deltaY = (rulerOffsetHeight - screenHeight) * 0.5
		this.offsetX = Math.ceil(deltaX)
		this.offsetY = Math.ceil(deltaY)
	}

	/* ---------------------------------------------------Ruler---------------------------------------------------*/
	get guideLines(): any {
		return this.ruler.guideLines
	}
	/* 开始拖动参考线 */
	public dragGuideLine(e: any, item: any): void {
		this.ruler.dragGuideLine(e, item)
	}
	public guideSite(type: string): number {
		if (type === 'h')
			return this.ruler.getActualPointerY(
				this.clientY,
				this.yRoom,
				this.zoom,
			)
		return this.ruler.getActualPointerX(
			this.clientX,
			this.xRoomL1,
			this.xRoomL2,
			this.zoom,
		)
	}

	/* 创建参考线/更新参考线 */
	public createGuideLine(type: string): any {
		if (this.ruler.dragGuideId) {
			const site = this.guideSite(type)
			const guideIndex = this.ruler.guideLines.findIndex(
				guide => guide.id === this.ruler.dragGuideId,
			)
			this.ruler.guideLines[guideIndex].site = site
		} else {
			const site = this.guideSite(type)
			const line = this.ruler.guideLines
			line.push({
				id: `${type}_${this.ruler.guideLines.length}`,
				type,
				site,
			})
			this.ruler.guideLines = line
		}
		this.ruler.dragGuideId = ''
		this.ruler.dragGuide = false
		return this.ruler.guideLines
	}
}
