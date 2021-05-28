import Vue from 'vue'
export default class Ruler {
	dragId = `drag-content-${+new Date()}`
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
	constructor() {}
	public static getInstance(): Ruler {
		if (
			!Vue.prototype.$ruler ||
			Object.keys(Vue.prototype.$ruler).length === 0
		) {
			Vue.prototype.$ruler = new Ruler()
		}
		return Vue.prototype.$ruler
	}
}
