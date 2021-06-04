import './index.scss'
import { uuid } from '@/core/utils'

export default class Guide {
	guideXLineClassName = 'd-ruler-guide-x'
	guideYLineClassName = 'd-ruler-guide-y'
	type: string
	num: number
	id: string
	rulerSize: number
	offset: number
	height: number
	width: number
	zoom: number
	father: HTMLElement | null

	constructor(obj: any) {
		this.id = uuid()
		this.num = obj.num
		this.zoom = obj.zoom
		this.type = obj.type
		this.father = obj.father
		this.rulerSize = obj.rulerSize
		this.height = obj.height
		this.width = obj.width
		this.offset = obj.offset
		this.init()
	}

	init(): void {
		const dom = document.createElement('div')
		dom.id = this.id
		if (this.type === 'x') {
			dom.className = this.guideXLineClassName
			dom.style.height = `${this.height + this.rulerSize}px`
			dom.style.transform = `translateX(${
				this.offset + this.num * this.zoom
			}px)`
			dom.innerHTML = `<div class="d-ruler-guide-x-num">${this.num}</div>`
		} else {
			dom.className = this.guideYLineClassName
			dom.style.width = `${this.width + this.rulerSize}px`
			dom.style.transform = `translateY(${
				this.offset + this.num * this.zoom
			}px)`
			dom.innerHTML = `<div class="d-ruler-guide-y-num">${this.num}</div>`
		}
		// dom.onmousedown = (e) => {
		// 	console.log(1)
		// }
		this.father.appendChild(dom)
	}
}
