import Vue from 'vue'
import Factory from '@/core/Base/factory'
import { screenShareUpdate } from '@/api/screenShare.api'

export default class Ruler extends Factory<Ruler> {
	/* 参考线 */
	guideLines = []
	/* 被移动线的ID */
	dragGuideId = ''
	/* 点击拖拽参考线 */
	dragGuide = false
	rulerSize = 18
	public getActualPointerX(
		num: number,
		xRoomL1: number,
		xRoomL2: number,
		zoom: number,
	): number {
		return ~~(
			(num - this.rulerSize - xRoomL1 - xRoomL2 - this.guideStartX) /
			zoom
		)
	}
	public getActualPointerY(num: number, yRoom: number, zoom: number): number {
		return ~~((num - this.rulerSize - yRoom - this.guideStartY) / zoom)
	}

	/* 开始拖动参考线 */
	public dragGuideLine(e: any, item: any): void {
		if (e.which !== 1) return
		if (e.offsetX + e.offsetY > this.rulerSize) return
		const { id } = item
		this.dragGuide = true
		this.dragGuideId = id
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
