/**
 * @description
 *
 * 画布高度 * （1-缩放比例）      ===》2边缩放距离
 * 2边缩放距离 / 2               ===》单边缩放距离
 * 单边缩放距离 + 面板拖动距离     ===》0点距离左侧边界像素值
 */
import './index.scss'
const bgImgX = new Image()
const bgImgY = new Image()
bgImgX.src =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAASCAIAAACW8RrQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3OEUyMEM3NzkyMTIxMUVCQkZGREJCREZEQzRBQUVFQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3OEUyMEM3ODkyMTIxMUVCQkZGREJCREZEQzRBQUVFQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjc4RTIwQzc1OTIxMjExRUJCRkZEQkJERkRDNEFBRUVDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjc4RTIwQzc2OTIxMjExRUJCRkZEQkJERkRDNEFBRUVDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+r9C/twAAAENJREFUeNpilJBWYRh8gElSXHQwOothUIJRZ406a9RZo84adRY9nIW/aqKd7BAJrYEKHjTZ0SRPCmA0NLIchM4CCDAAtx4DyLnOl1UAAAAASUVORK5CYII='
bgImgY.src =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAyCAIAAADeABw2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxQkM4MjEwRjkyMTMxMUVCOTlBQUQyOTQ0REY2ODNDMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxQkM4MjExMDkyMTMxMUVCOTlBQUQyOTQ0REY2ODNDMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFCQzgyMTBEOTIxMzExRUI5OUFBRDI5NDRERjY4M0MxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjFCQzgyMTBFOTIxMzExRUI5OUFBRDI5NDRERjY4M0MxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2HR8RgAAAE5JREFUeNpikZBWkRQXZSARsADx85evSdIDtIaJgSxAX20sJHmJHG3wkBtWQYKZjFhICozRVDKaSkZTyWgqGU0lo6lkNJWMphIiAECAAQCHcyGW+TXwowAAAABJRU5ErkJggg=='
export default class Ruler {
	xRoomL1: number = +localStorage.getItem('xRoomL1')
	xRoomL2: number = +localStorage.getItem('xRoomL2')
	xRoomR1: number = +localStorage.getItem('xRoomR1')
	yRoom = 60
	rulerContainerClassName = 'd-ruler-wrapper'
	rulerXContainerClassName = 'd-ruler-wrapper-x'
	rulerYContainerClassName = 'd-ruler-wrapper-y'
	rulerXId = 'ruler-x'
	rulerYId = 'ruler-y'
	rulerXLineId = 'd-ruler-line-x'
	rulerYLineId = 'd-ruler-line-y'
	width: number
	height: number
	screenWidth: number
	screenHeight: number
	zoom: number
	offsetY: number
	offsetX: number
	lineX: HTMLElement | null
	lineY: HTMLElement | null
	canvasX: HTMLCanvasElement | null
	canvasY: HTMLCanvasElement | null
	contextX2d = null
	contextY2d = null
	bgImgX = bgImgX
	bgImgY = bgImgY
	/* 标尺高度，容差 */
	rulerSize = 18
	/* 参考线开始移动的位置 */
	guideStartX = 0
	/* 参考线开始移动的位置 */
	guideStartY = 0
	/* 标尺步长 */
	stepLength = 50

	constructor() {
		const fatherX = this.createXFather()
		const fatherY = this.createYFather()
		const canvasX = this.createXCanvas()
		const canvasY = this.createYCanvas()
		const LineX = this.createGuideLineX()
		const LineY = this.createGuideLineY()
		fatherX.appendChild(canvasX)
		fatherX.appendChild(LineX)
		fatherY.appendChild(canvasY)
		fatherY.appendChild(LineY)
		window.addEventListener('resize', this.draw.bind(this))
	}

	windowResize() {
		const dom: HTMLElement = document.getElementsByClassName(
			this.rulerContainerClassName,
		)[0]
		this.width = dom.scrollWidth
		this.height = dom.scrollHeight
		this.canvasX.width = this.width
		this.canvasY.height = this.height
	}

	createGuideLineX(): HTMLElement {
		const dom = document.createElement('div')
		dom.id = this.rulerXLineId
		dom.style.display = 'none'
		dom.style.height = `${this.height + this.rulerSize}px`
		this.lineX = dom
		return dom
	}

	createGuideLineY(): HTMLElement {
		const dom = document.createElement('div')
		dom.id = this.rulerYLineId
		dom.style.display = 'none'
		dom.style.width = `${this.width + this.rulerSize}px`
		this.lineY = dom
		return dom
	}

	createYCanvas(): HTMLCanvasElement {
		const canvas = document.createElement('canvas')
		canvas.height = this.height
		canvas.width = this.rulerSize
		canvas.id = this.rulerYId
		this.canvasY = canvas
		this.contextY2d = this.canvasY.getContext('2d')
		return canvas
	}

	createXCanvas(): HTMLCanvasElement {
		const canvas = document.createElement('canvas')
		canvas.width = this.width
		canvas.id = this.rulerXId
		canvas.height = this.rulerSize
		this.canvasX = canvas
		this.contextX2d = this.canvasX.getContext('2d')
		return canvas
	}

	createXFather(): HTMLElement {
		const dom = document.createElement('div')
		dom.className = this.rulerXContainerClassName
		dom.style.width = `calc(100% - ${this.rulerSize}px)`
		document
			.getElementsByClassName(this.rulerContainerClassName)[0]
			.appendChild(dom)
		this.width = dom.offsetWidth
		dom.onmouseenter = e => {
			this.lineX.style.display = 'block'
			this.lineX.style.transform = `translateX(${
				e.clientX - this.rulerSize - this.xRoomL1 - this.xRoomL2
			}px)`
		}
		dom.onmousemove = e => {
			this.lineX.style.transform = `translateX(${
				e.clientX - this.rulerSize - this.xRoomL1 - this.xRoomL2
			}px)`
		}
		dom.onmouseleave = () => {
			this.lineX.style.display = 'none'
		}
		dom.onmousedown = function () {
			console.log('x', 'onmousedown')
		}
		return dom
	}

	createYFather(): HTMLElement {
		const dom = document.createElement('div')
		dom.className = this.rulerYContainerClassName
		dom.style.height = `calc(100% - ${this.rulerSize}px)`
		document
			.getElementsByClassName(this.rulerContainerClassName)[0]
			.appendChild(dom)
		this.height = dom.offsetHeight
		dom.onmouseenter = e => {
			this.lineY.style.display = 'block'
			this.lineY.style.transform = `translateY(${
				e.clientY - this.rulerSize - this.yRoom
			}px)`
		}
		dom.onmousemove = e => {
			this.lineY.style.transform = `translateY(${
				e.clientY - this.rulerSize - this.yRoom
			}px)`
		}
		dom.onmouseleave = () => {
			this.lineY.style.display = 'none'
		}
		dom.onmousedown = () => {
			console.log('y', 'onmousedown')
		}
		return dom
	}

	draw({
		screenWidth,
		screenHeight,
		offsetY,
		offsetX,
		zoom,
		xRoomL1,
		xRoomL2,
	}: any = {}) {
		if (!isNaN(screenWidth)) this.screenWidth = screenWidth
		if (!isNaN(screenHeight)) this.screenHeight = screenHeight
		if (!isNaN(zoom)) this.zoom = zoom
		if (!isNaN(offsetY)) this.offsetY = offsetY
		if (!isNaN(offsetX)) this.offsetX = offsetX
		if (!isNaN(xRoomL1)) this.xRoomL1 = xRoomL1
		if (!isNaN(xRoomL2)) this.xRoomL2 = xRoomL2
		this.windowResize()
		const diffX = (this.screenWidth * (1 - this.zoom)) / 2 + this.offsetX
		const diffY = (this.height * (1 - this.zoom)) / 2 + this.offsetY
		this.contextX2d.translate(diffX - this.guideStartX, 0)
		this.contextY2d.translate(0, diffY - this.guideStartY)
		this.guideStartX = diffX
		this.guideStartY = diffY
		this.contextY2d.font = '10px sans-serif'
		this.contextY2d.fillStyle = '#999'
		this.contextX2d.font = '10px sans-serif'
		this.contextX2d.fillStyle = '#999'
		this.clearRulerCanvas()
		this.initDrawX()
		this.initDrawY()
	}

	public clearRulerCanvas(): void {
		const tx = this.contextX2d.getTransform()
		const ty = this.contextY2d.getTransform()
		const wx = this.canvasX.width - tx.e
		const hx = this.canvasX.height
		this.contextX2d.clearRect(-tx.e, 0, wx, hx)
		const wy = this.canvasY.width
		const hy = this.canvasY.height - ty.e
		this.contextY2d.clearRect(-ty.e, 0, wy, hy)
	}

	private initDrawX(): void {
		const t = this.contextX2d.getTransform()
		let x = 0
		while (x < this.canvasX.width - t.e) {
			this.contextX2d.drawImage(this.bgImgX, x, 0)
			this.contextX2d.fillText(~~(x / this.zoom), x + 4, 10)
			x = x + this.stepLength
		}

		if (t.e > 0) {
			let xe = 0
			while (xe < t.e) {
				xe = xe + this.stepLength
				this.contextX2d.drawImage(this.bgImgX, -xe, 0)
				this.contextX2d.fillText(
					xe === 0 ? '0' : -~~(xe / this.zoom),
					-xe + 2,
					10,
				)
			}
		}
	}
	public initDrawY(): void {
		const t = this.contextY2d.getTransform()
		let x = 0
		while (x < this.canvasY.height - t.f) {
			this.contextY2d.save()
			this.contextY2d.drawImage(this.bgImgY, 0, x)
			this.contextY2d.translate(10, x)
			this.contextY2d.rotate(-Math.PI / 2)
			const num = ~~(x / this.zoom)
			this.contextY2d.fillText(num, -num.toString().length * 8, 0)
			x = x + this.stepLength
			this.contextY2d.restore()
		}
		if (t.f > 0) {
			let xe = 0
			while (xe < t.f) {
				this.contextY2d.save()
				xe = xe + this.stepLength
				this.contextY2d.drawImage(this.bgImgY, 0, -xe)
				this.contextY2d.translate(10, -xe + 28)
				this.contextY2d.rotate(-Math.PI / 2)
				this.contextY2d.fillText(~~-(xe / this.zoom), 2, 0)
				this.contextY2d.restore()
			}
		}
	}
}
