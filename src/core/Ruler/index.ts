import Vue from 'vue'
import event from '@/store/event.store'
import Factory from '@/core/Base/factory'
import { screenShareUpdate } from '@/api/screenShare.api'

export default class Ruler extends Factory<Ruler> {
	dragId = `drag-content-${+new Date()}`
	xRoomL1: number = +localStorage.getItem('xRoomL1')
	xRoomL2: number = +localStorage.getItem('xRoomL2')
	xRoomR1: number = +localStorage.getItem('xRoomR1')
	yRoom = 60
	/* 参考线 */
	guideLines = []
	/* 参考线开始移动的位置 */
	guideStartX = 0
	/* 参考线开始移动的位置 */
	guideStartY = 0
	/* 参考线可见 */
	guideVisible = true
	/* 当前位置x */
	private _contentX = 0
	/* 当前位置y */
	private _contentY = 0
	/* 滚动距离 */
	contentScrollLeft = 0
	/* 滚动距离 */
	contentScrollTop = 0
	/* 被移动线的ID */
	dragGuideId = ''
	/* 标尺步长 */
	stepLength = 50
	/* 标尺高度，容差 */
	rulerSize = 18
	/* 当前标尺zoom */
	private _zoom = 1
	/* 当前标尺zoom步长 */
	zoomStep = 0.02
	/* 当前画布大小宽 */
	width = 0
	/* 当前画布大小高 */
	height = 0
	/* 点击拖拽参考线 */
	dragGuide = false
	/* x轴上下文 */
	contextX = null
	canvasX = null
	bgImgX = new Image()
	loadImgX = false
	/* y轴上下文 */
	contextY = null
	canvasY = null
	bgImgY = new Image()
	loadImgY = false
	
	get zoom() {
		return this._zoom
	}
	set zoom(val) {
		this._zoom = val
		this.initX()
		this.initY()
	}
	
	get contentX() {
		return this._contentX
	}
	set contentX(val) {
		this._contentX = val
		this.initX()
	}
	
	get contentY() {
		return this._contentY
	}
	set contentY(val) {
		this._contentY = val
		this.initY()
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

	get rulerStyle(): string {
		return `transform:translate3d(${this.contentX}px, ${
			this.contentY
		}px, 0) scale(${this.zoom});width:${this.width + 18 * 2} px;height:${
			this.height + 18 * 2
		} px;`
	}
	/* 上下左右滚动画布 */
	public wheelRulerContentPosition(e: any): void {
		e.preventDefault()
		if (!e.ctrlKey) {
			if (e.shiftKey) {
				this.contentX += e.wheelDelta > 0 ? 10 : -10
			} else {
				this.contentY += e.wheelDelta > 0 ? 10 : -10
			}
		}
	}
	/* 缩放滚动画布 */
	public wheelRulerContentZoom(e: any): void {
		if (e.ctrlKey) {
			e.preventDefault()
			e.stopPropagation()
			if (e.wheelDelta > 0) {
				this.zoomIn()
			} else {
				this.zoomOut()
			}
		}
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

	public getActualPointerX(num: number): number {
		return ~~(
			(num -
				this.rulerSize -
				this.xRoomL1 -
				this.xRoomL2 -
				this.guideStartX) /
			this.zoom
		)
	}
	public getActualPointerY(num: number): number {
		return ~~(
			(num - this.rulerSize - this.yRoom - this.guideStartY) /
			this.zoom
		)
	}

	public guideSite(type: string): number {
		if (type === 'h') return this.getActualPointerY(event.state.clientY)
		return this.getActualPointerX(event.state.clientX)
	}

	/* 开始拖动参考线 */
	public dragGuideLine(e: any, item: any): void {
		if (e.which !== 1) return
		if (e.offsetX + e.offsetY > this.rulerSize) return
		const { id } = item
		this.dragGuide = true
		this.dragGuideId = id
	}

	/* 创建参考线/更新参考线 */
	public createGuideLine(type: string, screenId: string): void {
		if (this.dragGuideId) {
			const site = this.guideSite(type)
			const guideIndex = this.guideLines.findIndex(
				guide => guide.id === this.dragGuideId,
			)
			this.guideLines[guideIndex].site = site
		} else {
			const site = this.guideSite(type)
			const line = this.guideLines
			line.push({
				id: `${type}_${this.guideLines.length}`,
				type,
				site,
			})
			this.guideLines = line
		}
		this.dragGuideId = ''
		this.dragGuide = false
		// if (screenId) this.updateRuler(screenId)
	}

	public updateRuler(screenId: string): void {
		screenShareUpdate({
			screenId,
			screenGuide: this.guideLines,
		}).then(() => {
			Vue.prototype.$Message.success('参考线更新成功')
		})
	}

	public clearGuides(screenId: string): void {
		if (this.guideLines.length > 0) {
			Vue.prototype.$Modal.confirm({
				title: '确定是否清空参考线？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.guideLines = []
					this.updateRuler(screenId)
				},
			})
		} else {
			Vue.prototype.$Message.sucess('当前没有可清空的参考线')
		}
	}
	
	/********* x轴画布 ******************/
	/**
	 * @description
	 *
	 * 画布高度 * （1-缩放比例）      ===》2边缩放距离
	 * 2边缩放距离 / 2               ===》单边缩放距离
	 * 单边缩放距离 + 面板拖动距离     ===》0点距离左侧边界像素值
	 */
	public initX(options: {el?: string, width?: number} = {}) {
		if (options.width) {
			this.width = options.width
		}
		if (!this.contextX) {
			this.canvasX = document.getElementById(options.el)
			this.contextX = this.canvasX.getContext('2d')
			this.contextX.font = '10px sans-serif'
			this.contextX.fillStyle = '#999'
		}
		this.contextX.translate(
			(this.width * (1 - this.zoom)) / 2 +
			this.contentX -
			this.guideStartX,
			0,
		)
		this.guideStartX =
			(this.width * (1 - this.zoom)) / 2 +
			this.contentX
		if (this.loadImgX) {
			this.initDrawX()
		} else {
			this.bgImgX.src =
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAASCAIAAACW8RrQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3OEUyMEM3NzkyMTIxMUVCQkZGREJCREZEQzRBQUVFQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3OEUyMEM3ODkyMTIxMUVCQkZGREJCREZEQzRBQUVFQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjc4RTIwQzc1OTIxMjExRUJCRkZEQkJERkRDNEFBRUVDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjc4RTIwQzc2OTIxMjExRUJCRkZEQkJERkRDNEFBRUVDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+r9C/twAAAENJREFUeNpilJBWYRh8gElSXHQwOothUIJRZ406a9RZo84adRY9nIW/aqKd7BAJrYEKHjTZ0SRPCmA0NLIchM4CCDAAtx4DyLnOl1UAAAAASUVORK5CYII='
			this.bgImgX.onload = () => {
				this.loadImgX = true
				this.initDrawX()
			}
		}
	}
	
	private initDrawX() {
		this.clearRulerCanvasX()
		const t = this.contextX.getTransform()
		let x = 0
		while (x < this.canvasX.width - t.e) {
			this.contextX.drawImage(this.bgImgX, x, 0)
			this.contextX.font = '10px sans-serif'
			this.contextX.fillStyle = '#999'
			this.contextX.fillText(~~(x / this.zoom), x + 4, 10)
			x = x + this.stepLength
		}

		if (t.e > 0) {
			let xe = 0
			while (xe < t.e) {
				xe = xe + this.stepLength
				this.contextX.drawImage(this.bgImgX, -xe, 0)
				this.contextX.font = '10px sans-serif'
				this.contextX.fillStyle = '#999'
				this.contextX.fillText(
					xe === 0 ? '0' : -~~(xe / this.zoom),
					-xe + 2,
					10,
				)
			}
		}
	}

	clearRulerCanvasX() {
		const t = this.contextX.getTransform()
		this.canvasX.width =
			document.getElementById('d-editor').offsetWidth -
			this.rulerSize
		this.contextX.clearRect(
			-t.e,
			0,
			this.canvasX.width - t.e,
			this.canvasX.height,
		)
	}
	/********* x轴画布 ******************/

	/********* y轴画布 ******************/
	public initY(options: {el?: string, height?: number} = {}) {
		if (options.height) {
			this.height = options.height
		}
		if (!this.contextY) {
			this.canvasY = document.getElementById(options.el)
			this.contextY = this.canvasY.getContext('2d')
			this.contextY.font = '10px sans-serif'
			this.contextY.fillStyle = '#999'
		}
		this.contextY.translate(
			0,
			(this.height * (1 - this.zoom)) / 2 + this.contentY - this.guideStartY,
		)
		this.guideStartY =
			(this.height * (1 - this.zoom)) / 2 + this.contentY
		if (this.loadImgY) {
			this.initDrawY()
		} else {
			this.bgImgY.src =
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAyCAIAAADeABw2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxQkM4MjEwRjkyMTMxMUVCOTlBQUQyOTQ0REY2ODNDMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxQkM4MjExMDkyMTMxMUVCOTlBQUQyOTQ0REY2ODNDMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFCQzgyMTBEOTIxMzExRUI5OUFBRDI5NDRERjY4M0MxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjFCQzgyMTBFOTIxMzExRUI5OUFBRDI5NDRERjY4M0MxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2HR8RgAAAE5JREFUeNpikZBWkRQXZSARsADx85evSdIDtIaJgSxAX20sJHmJHG3wkBtWQYKZjFhICozRVDKaSkZTyWgqGU0lo6lkNJWMphIiAECAAQCHcyGW+TXwowAAAABJRU5ErkJggg=='
			this.bgImgY.onload = () => {
				this.loadImgY = true
				this.initDrawY()
			}
		}
	}

	initDrawY() {
		this.clearRulerCanvasY()
		const t = this.contextY.getTransform()
		let x = 0
		this.contextY.font = '10px sans-serif'
		this.contextY.fillStyle = '#999'
		while (x < this.canvasY.height - t.f) {
			this.contextY.save()
			this.contextY.drawImage(this.bgImgY, 0, x)
			this.contextY.translate(10, x)
			this.contextY.rotate(-Math.PI / 2)
			const num = ~~(x / this.zoom)
			this.contextY.fillText(num, -num.toString().length * 8, 0)
			x = x + this.stepLength
			this.contextY.restore()
		}

		if (t.f > 0) {
			let xe = 0
			while (xe < t.f) {
				this.contextY.save()
				xe = xe + this.stepLength
				this.contextY.drawImage(this.bgImgY, 0, -xe)
				this.contextY.translate(10, -xe + 28)
				this.contextY.rotate(-Math.PI / 2)
				this.contextY.fillText(~~-(xe / this.zoom), 2, 0)
				this.contextY.restore()
			}
		}
	}

	clearRulerCanvasY() {
		const t = this.contextY.getTransform()
		this.canvasY.height =
			document.getElementById('d-editor').offsetHeight -
			this.rulerSize
		this.contextY.clearRect(
			-t.e,
			0,
			this.canvasY.width,
			this.canvasY.height - t.e,
		)
	}
	/********* y轴画布 ******************/
}
