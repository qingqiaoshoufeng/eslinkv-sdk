import Factory from '@/core/Base/factory'
import Ruler from '@/core/Ruler'

export default class Eve extends Factory<Screen> {
	private ruler: Ruler = Ruler.Instance()
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
	/* 滚动左右距离 */
	contentScrollLeft = 0
	/* 滚动上下距离 */
	contentScrollTop = 0
	/* 当前标尺zoom */
	private _zoom = 1
	/* 当前标尺zoom步长 */
	zoomStep = 0.02
	/* 当前位置x */
	contentX = 0
	/* 当前位置y */
	contentY = 0

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
	public resetZoom(contentId: string, width: number, height: number): void {
		const rulerContent = document.getElementById(contentId)
		const rulerOffsetWidth = rulerContent.offsetWidth - this.ruler.rulerSize
		this.zoom = ~~((rulerOffsetWidth / width) * 100) / 100 || this.zoomStep
		const rulerOffsetHeight = rulerContent.offsetHeight
		const deltaX = (rulerOffsetWidth - width) * 0.5
		const deltaY = (rulerOffsetHeight - height) * 0.5
		this.contentX = Math.ceil(deltaX)
		this.contentY = Math.ceil(deltaY)
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

	/********* x轴画布 ******************/
	/**
	 * @description
	 *
	 * 画布高度 * （1-缩放比例）      ===》2边缩放距离
	 * 2边缩放距离 / 2               ===》单边缩放距离
	 * 单边缩放距离 + 面板拖动距离     ===》0点距离左侧边界像素值
	 */
	public initRuler({ el, width, height, type }: any): void {
		const d = type === 'x' ? 'contextX2d' : 'contextY2d'
		if (!this.ruler.canvas[d]) {
			const ele = type === 'x' ? 'xEle' : 'yEle'
			this.ruler.canvas[ele] = document.getElementById(el)
			this.ruler.canvas[d] = this.ruler.canvas[ele].getContext('2d')
			if (type === 'x') {
				this.ruler.canvas[ele].width =
					document.getElementById('d-editor').offsetWidth -
					this.ruler.rulerSize
			} else {
				this.ruler.canvas[ele].height =
					document.getElementById('d-editor').offsetHeight -
					this.ruler.rulerSize
			}
		}
		this.ruler.canvas[d].font = '10px sans-serif'
		this.ruler.canvas[d].fillStyle = '#999'
		let diff
		if (type === 'x') {
			diff = (width * (1 - this.zoom)) / 2 + this.contentX
			this.ruler.canvas.contextX2d.translate(
				diff - this.ruler.guideStartX,
				0,
			)
			this.ruler.guideStartX = diff
			this.clearRulerCanvas(type)
			this.initDrawX(this.zoom)
		} else {
			diff = (height * (1 - this.zoom)) / 2 + this.contentY
			this.ruler.canvas.contextY2d.translate(
				0,
				diff - this.ruler.guideStartY,
			)
			this.ruler.guideStartY = diff
			this.clearRulerCanvas(type)
			this.initDrawY(this.zoom)
		}
	}
	private initDrawX(zoom: number): void {
		const t = this.ruler.canvas.contextX2d.getTransform()
		let x = 0
		while (x < this.ruler.canvas.xEle.width - t.e) {
			this.ruler.canvas.contextX2d.drawImage(
				this.ruler.canvas.bgImgX,
				x,
				0,
			)
			this.ruler.canvas.contextX2d.fillText(~~(x / zoom), x + 4, 10)
			x = x + this.ruler.stepLength
		}

		if (t.e > 0) {
			let xe = 0
			while (xe < t.e) {
				xe = xe + this.ruler.stepLength
				this.ruler.canvas.contextX2d.drawImage(
					this.ruler.canvas.bgImgX,
					-xe,
					0,
				)
				this.ruler.canvas.contextX2d.fillText(
					xe === 0 ? '0' : -~~(xe / zoom),
					-xe + 2,
					10,
				)
			}
		}
	}
	public clearRulerCanvas(type: string): void {
		const ele = type === 'x' ? 'xEle' : 'yEle'
		const d = type === 'x' ? 'contextX2d' : 'contextY2d'
		const t = this.ruler.canvas[d].getTransform()
		const w =
			type === 'x'
				? this.ruler.canvas[ele].width - t.e
				: this.ruler.canvas[ele].width
		const h =
			type === 'x'
				? this.ruler.canvas[ele].height
				: this.ruler.canvas[ele].height - t.e
		this.ruler.canvas[d].clearRect(-t.e, 0, w, h)
	}
	public initDrawY(zoom: number): void {
		const t = this.ruler.canvas.contextY2d.getTransform()
		let x = 0
		while (x < this.ruler.canvas.yEle.height - t.f) {
			this.ruler.canvas.contextY2d.save()
			this.ruler.canvas.contextY2d.drawImage(
				this.ruler.canvas.bgImgY,
				0,
				x,
			)
			this.ruler.canvas.contextY2d.translate(10, x)
			this.ruler.canvas.contextY2d.rotate(-Math.PI / 2)
			const num = ~~(x / zoom)
			this.ruler.canvas.contextY2d.fillText(
				num,
				-num.toString().length * 8,
				0,
			)
			x = x + this.ruler.stepLength
			this.ruler.canvas.contextY2d.restore()
		}

		if (t.f > 0) {
			let xe = 0
			while (xe < t.f) {
				this.ruler.canvas.contextY2d.save()
				xe = xe + this.ruler.stepLength
				this.ruler.canvas.contextY2d.drawImage(
					this.ruler.canvas.bgImgY,
					0,
					-xe,
				)
				this.ruler.canvas.contextY2d.translate(10, -xe + 28)
				this.ruler.canvas.contextY2d.rotate(-Math.PI / 2)
				this.ruler.canvas.contextY2d.fillText(~~-(xe / zoom), 2, 0)
				this.ruler.canvas.contextY2d.restore()
			}
		}
	}
}
