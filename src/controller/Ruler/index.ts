import Vue from 'vue'
import event from '@/store/event.store'
export default class Ruler {
	dragId = `drag-content-${+new Date()}`
	xRoomL1 = +localStorage.getItem('xRoomL1')
	xRoomL2 = +localStorage.getItem('xRoomL2')
	xRoomR1 = +localStorage.getItem('xRoomR1')
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
	contentX = 0
	/* 当前位置y */
	contentY = 0
	/* 滚动距离 */
	contentScrollLeft = 0
	/* 滚动距离 */
	contentScrollTop = 0
	/* 被移动线的ID */
	dragGuideId = ''
	/* 标尺步长 */
	stepLength = 50
	/* 标尺高度，容差 */
	size = 18
	/* 当前标尺zoom */
	zoom = 1
	/* 当前标尺zoom步长 */
	zoomStep = 0.02
	public static getInstance(): Ruler {
		if (
			!Vue.prototype.$ruler ||
			Object.keys(Vue.prototype.$ruler).length === 0
		) {
			Vue.prototype.$ruler = new Ruler()
			return Vue.prototype.$ruler
		}
	}

	public zoomIn(step = 2): void {
		this.zoom = +((this.zoom * 100 + step) / 100).toFixed(2)
	}

	public zoomOut(step = 2): void {
		if (this.zoom * 100 > step) {
			this.zoom = +((this.zoom * 100 - step) / 100).toFixed(2)
		}
	}

	public resetZoom(): void {
		const rulerContent = document.getElementById('ruler-content')
		const rulerOffsetWidth = rulerContent.offsetWidth - this.size
		const rulerOffsetHeight = rulerContent.offsetHeight
		const screen = Vue.prototype.$screen
		const width = screen.width
		const height = screen.height
		this.zoom = ~~((rulerOffsetWidth / width) * 100) / 100 || this.zoomStep
		const deltaX = (rulerOffsetWidth - width) * 0.5
		const deltaY = (rulerOffsetHeight - height) * 0.5
		this.contentX = Math.ceil(deltaX)
		this.contentY = Math.ceil(deltaY)
	}
	getActualPointerX(num) {
		return ~~(
			(num - this.size - this.xRoomL1 - this.xRoomL2 - this.guideStartX) /
			this.zoom
		)
	}
	getActualPointerY(num) {
		return ~~((num - this.size - this.yRoom - this.guideStartY) / this.zoom)
	}
	public guideSite(type: string) {
		if (type === 'h') return this.getActualPointerY(event.state.clientY)
		return this.getActualPointerX(event.state.clientX)
	}

	public guideCreate(type): void {
		const site = this.guideSite(type)
		const line = this.guideLines
		line.push({
			id: `${type}_${this.guideLines.length}`,
			type,
			site,
		})
		this.guideLines = line
	}

	public changeGuideLine(type): void {
		const site = this.guideSite(type)
		const guideIndex = this.guideLines.findIndex(
			guide => guide.id === this.dragGuideId,
		)
		this.guideLines[guideIndex].site = site
	}
}
