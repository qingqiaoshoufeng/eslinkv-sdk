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
	rulerSize = 18
	/* 当前标尺zoom */
	zoom = 1
	/* 当前标尺zoom步长 */
	zoomStep = 0.02
	/* 当前画布大小宽 */
	width = 0
	/* 当前画布大小高 */
	height = 0
	/* 点击拖拽参考线 */
	dragGuide = false

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
}
