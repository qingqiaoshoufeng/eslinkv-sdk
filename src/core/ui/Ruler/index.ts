/**
 * @description
 *
 * 画布高度 * （1-缩放比例）      ===》2边缩放距离
 * 2边缩放距离 / 2               ===》单边缩放距离
 * 单边缩放距离 + 面板拖动距离     ===》0点距离左侧边界像素值
 */
import './index.scss'
import Guide from '@/core/ui/Guide'
const bgImgX = new Image()
const bgImgY = new Image()
bgImgX.src =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAASCAIAAACW8RrQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3OEUyMEM3NzkyMTIxMUVCQkZGREJCREZEQzRBQUVFQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3OEUyMEM3ODkyMTIxMUVCQkZGREJCREZEQzRBQUVFQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjc4RTIwQzc1OTIxMjExRUJCRkZEQkJERkRDNEFBRUVDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjc4RTIwQzc2OTIxMjExRUJCRkZEQkJERkRDNEFBRUVDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+r9C/twAAAENJREFUeNpilJBWYRh8gElSXHQwOothUIJRZ406a9RZo84adRY9nIW/aqKd7BAJrYEKHjTZ0SRPCmA0NLIchM4CCDAAtx4DyLnOl1UAAAAASUVORK5CYII='
bgImgY.src =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAyCAIAAADeABw2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxQkM4MjEwRjkyMTMxMUVCOTlBQUQyOTQ0REY2ODNDMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxQkM4MjExMDkyMTMxMUVCOTlBQUQyOTQ0REY2ODNDMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFCQzgyMTBEOTIxMzExRUI5OUFBRDI5NDRERjY4M0MxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjFCQzgyMTBFOTIxMzExRUI5OUFBRDI5NDRERjY4M0MxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2HR8RgAAAE5JREFUeNpikZBWkRQXZSARsADx85evSdIDtIaJgSxAX20sJHmJHG3wkBtWQYKZjFhICozRVDKaSkZTyWgqGU0lo6lkNJWMphIiAECAAQCHcyGW+TXwowAAAABJRU5ErkJggg=='
export default class Ruler {
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
	diffY: number
	diffX: number
	offsetY: number
	offsetX: number
	lineXDom: HTMLElement | null
	lineYDom: HTMLElement | null
	canvasX: HTMLCanvasElement | null
	canvasY: HTMLCanvasElement | null
	contextX2d = null
	contextY2d = null
	bgImgX = bgImgX
	bgImgY = bgImgY
	/* 标尺高度，容差 */
	rulerSize = 18
	/* 标尺步长 */
	stepLength = 50
	/* 参考线 */
	guideLines = []
	guideLinesXDom: HTMLElement | null
	guideLinesYDom: HTMLElement | null

	constructor() {
		const fatherX = this.createXFather()
		const fatherY = this.createYFather()
		const canvasX = this.createXCanvas()
		const canvasY = this.createYCanvas()
		const lineXDom = this.createGuideLineX()
		const lineYDom = this.createGuideLineY()
		const guideX = this.createGuideXFather()
		const guideY = this.createGuideYFather()
		fatherX.appendChild(canvasX)
		fatherX.appendChild(lineXDom)
		fatherX.appendChild(guideX)
		fatherY.appendChild(canvasY)
		fatherY.appendChild(lineYDom)
		fatherY.appendChild(guideY)
		window.addEventListener('keyup', this.keyup.bind(this))
		window.addEventListener('resize', this.draw.bind(this))
	}

	/* 画布还原最佳比例 */
	public resetZoom({
		screenWidth,
		screenHeight,
		offsetY,
		offsetX,
		zoom,
	}: any = {}): void {
		if (!isNaN(screenWidth)) this.screenWidth = screenWidth
		if (!isNaN(screenHeight)) this.screenHeight = screenHeight
		const dom: HTMLElement = document.getElementsByClassName(
			this.rulerContainerClassName,
		)[0]
		this.zoom = ~~((dom.offsetWidth / this.screenWidth) * 100) / 100
		const deltaX = (dom.offsetWidth - this.screenWidth) * 0.5
		const deltaY = (dom.offsetHeight - this.screenHeight) * 0.5
		this.offsetX = Math.ceil(deltaX)
		this.offsetY = Math.ceil(deltaY)
		this.draw({
			screenWidth,
			screenHeight,
			offsetY,
			offsetX,
			zoom,
		})
	}
	private windowResize(): void {
		const dom: HTMLElement = document.body
		this.width = dom.offsetWidth
		this.height = dom.offsetHeight
		this.canvasX.width = this.width
		this.canvasY.height = this.height
	}
	private createGuideLineX(): HTMLElement {
		const dom = document.createElement('div')
		dom.id = this.rulerXLineId
		dom.style.display = 'none'
		dom.style.height = `${this.height + this.rulerSize}px`
		this.lineXDom = dom
		return dom
	}
	private createGuideLineY(): HTMLElement {
		const dom = document.createElement('div')
		dom.id = this.rulerYLineId
		dom.style.display = 'none'
		dom.style.width = `${this.width + this.rulerSize}px`
		this.lineYDom = dom
		return dom
	}
	private createYCanvas(): HTMLCanvasElement {
		const canvas = document.createElement('canvas')
		canvas.height = this.height
		canvas.width = this.rulerSize
		canvas.id = this.rulerYId
		this.canvasY = canvas
		this.contextY2d = this.canvasY.getContext('2d')
		return canvas
	}
	private createXCanvas(): HTMLCanvasElement {
		const canvas = document.createElement('canvas')
		canvas.width = this.width
		canvas.id = this.rulerXId
		canvas.height = this.rulerSize
		this.canvasX = canvas
		this.contextX2d = this.canvasX.getContext('2d')
		return canvas
	}
	private createGuideXFather(): HTMLElement {
		const dom = document.createElement('div')
		this.guideLinesXDom = dom
		return dom
	}
	private createGuideYFather(): HTMLElement {
		const dom = document.createElement('div')
		this.guideLinesYDom = dom
		return dom
	}
	private createXFather(): HTMLElement {
		const dom = document.createElement('div')
		dom.className = this.rulerXContainerClassName
		dom.style.width = `calc(100% - ${this.rulerSize}px)`
		document
			.getElementsByClassName(this.rulerContainerClassName)[0]
			.appendChild(dom)
		this.width = dom.offsetWidth
		dom.onmouseenter = e => {
			this.lineXDom.style.display = 'block'
			this.lineXDom.style.transform = `translateX(${e.layerX}px)`
			const t = this.contextX2d.getTransform()
			const num = ~~((e.layerX - t.e) / this.zoom)
			this.lineXDom.innerHTML = `<div class="d-ruler-line-x-num">${num}</div>`
		}
		dom.onmousemove = e => {
			this.lineXDom.style.transform = `translateX(${e.layerX}px)`
			const t = this.contextX2d.getTransform()
			const num = ~~((e.layerX - t.e) / this.zoom)
			this.lineXDom.innerHTML = `<div class="d-ruler-line-x-num">${num}</div>`
		}
		dom.onmouseleave = () => {
			this.lineXDom.style.display = 'none'
		}
		dom.onmousedown = e => {
			if (e.buttons !== 1 || e.which !== 1) return
			const t = this.contextX2d.getTransform()
			const num = ~~((e.layerX - t.e) / this.zoom)
			const guide = new Guide({
				num,
				type: 'x',
				father: this.guideLinesXDom,
				offset: this.diffX,
				zoom: this.zoom,
				width: this.width,
				height: this.height,
				rulerSize: this.rulerSize,
			})
			this.guideLines.push(guide)
		}
		return dom
	}

	private createYFather(): HTMLElement {
		const dom = document.createElement('div')
		dom.className = this.rulerYContainerClassName
		dom.style.height = `calc(100% - ${this.rulerSize}px)`
		document
			.getElementsByClassName(this.rulerContainerClassName)[0]
			.appendChild(dom)
		this.height = dom.offsetHeight
		dom.onmouseenter = e => {
			this.lineYDom.style.display = 'block'
			this.lineYDom.style.transform = `translateY(${e.layerY}px)`
			const t = this.contextY2d.getTransform()
			const num = ~~((e.layerY - t.f) / this.zoom)
			this.lineYDom.innerHTML = `<div class="d-ruler-line-y-num">${num}</div>`
		}
		dom.onmousemove = e => {
			this.lineYDom.style.transform = `translateY(${e.layerY}px)`
			const t = this.contextY2d.getTransform()
			const num = ~~((e.layerY - t.f) / this.zoom)
			this.lineYDom.innerHTML = `<div class="d-ruler-line-y-num">${num}</div>`
		}
		dom.onmouseleave = () => {
			this.lineYDom.style.display = 'none'
		}
		dom.onmousedown = e => {
			if (e.buttons !== 1 || e.which !== 1) return
			const t = this.contextY2d.getTransform()
			const num = ~~((e.layerY - t.f) / this.zoom)
			const guide = new Guide({
				num,
				type: 'y',
				father: this.guideLinesYDom,
				offset: this.diffY,
				zoom: this.zoom,
				width: this.width,
				height: this.height,
				rulerSize: this.rulerSize,
			})
			this.guideLines.push(guide)
		}
		return dom
	}

	public draw({
		screenWidth,
		screenHeight,
		offsetY,
		offsetX,
		zoom,
	}: any = {}): void {
		if (!isNaN(screenWidth)) this.screenWidth = screenWidth
		if (!isNaN(screenHeight)) this.screenHeight = screenHeight
		if (!isNaN(zoom)) this.zoom = zoom
		if (!isNaN(offsetY)) this.offsetY = offsetY
		if (!isNaN(offsetX)) this.offsetX = offsetX
		this.windowResize()
		const diffX = (this.screenWidth * (1 - this.zoom)) / 2 + this.offsetX
		const diffY = (this.screenHeight * (1 - this.zoom)) / 2 + this.offsetY
		this.diffX = diffX
		this.diffY = diffY
		this.contextX2d.translate(diffX, 0)
		this.contextY2d.translate(0, diffY)
		this.contextY2d.font = '10px sans-serif'
		this.contextY2d.fillStyle = '#999'
		this.contextX2d.font = '10px sans-serif'
		this.contextX2d.fillStyle = '#999'
		this.clearRulerCanvas()
		this.clearGuide()
		this.initDrawX()
		this.initDrawY()
		this.initGuide()
	}

	private initGuide(): void {
		this.guideLines.forEach(item => {
			new Guide({
				num: item.num,
				type: item.type,
				father: item.father,
				offset: item.type === 'x' ? this.diffX : this.diffY,
				zoom: this.zoom,
				width: this.width,
				height: this.height,
				rulerSize: this.rulerSize,
			})
		})
	}
	private keyup(e): void {
		switch (e.keyCode) {
			case 67: // c
				if (e.altKey) {
					const r = confirm('确定是否清空参考线？')
					if (r) {
						this.clearGuide()
						this.guideLines = []
					}
				}
				break
		}
	}
	private clearGuide(): void {
		this.guideLinesYDom.innerHTML = ''
		this.guideLinesXDom.innerHTML = ''
	}
	private clearRulerCanvas(): void {
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
	private initDrawY(): void {
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
