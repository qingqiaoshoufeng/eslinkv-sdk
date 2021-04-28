/**
 * @description 平台信息
 */
import Vue from 'vue'
import { store } from './index'
import platform from './platform.store'

const state = Vue.observable({
	dragId: `drag-content-${+new Date()}`,
	origin: '',
	xRoomL1: 238,
	xRoomL2: 238,
	xRoomR1: 350,
	yRoom: 60,
	guideLines: [], // 参考线
	guideStartX: 0, // 参考线开始移动的位置
	guideStartY: 0, // 参考线开始移动的位置
	guideVisible: true, // 参考线可见
	contentX: 0, // 当前位置x
	contentY: 0, // 当前位置y
	contentScrollLeft: 0, // 滚动距离
	contentScrollTop: 0, // 滚动距离
	dragGuideId: '', // 被移动线的ID
	stepLength: 50, // 标尺步长
	size: 18, // 标尺高度，容差
	zoom: 1,
	zoomStep: 0.02,
	dragFlag: '', // 拖动开始标记，可能值x(从水平标尺开始拖动),y(从垂直标尺开始拖动)
})
const actions = {
	/**
	 * @description 恢复默认缩放比例+居中
	 */
	resetZoom() {
		const rulerContent = document.getElementById('ruler-content')
		const rulerOffsetWidth = rulerContent.offsetWidth - state.size
		const rulerOffsetHeight = rulerContent.offsetHeight
		const platformWidth = platform.state.panelConfig.size.width
		const platformHeight = platform.state.panelConfig.size.height
		state.zoom =
			~~((rulerOffsetWidth / platformWidth) * 100) / 100 || state.zoomStep
		const deltaX = (rulerOffsetWidth - platformWidth) * 0.5
		const deltaY = (rulerOffsetHeight - platformHeight) * 0.5
		state.contentX = Math.ceil(deltaX)
		state.contentY = Math.ceil(deltaY)
	},
	zoomIn(step = 2) {
		if (state.zoom < 4) {
			state.zoom = +((state.zoom * 100 + step) / 100).toFixed(2)
		}
	},
	zoomOut(step = 2) {
		if (state.zoom > state.zoomStep) {
			state.zoom = +((state.zoom * 100 - step) / 100).toFixed(2)
		}
	},
	changeGuideLine(site) {
		const guideIndex = state.guideLines.findIndex(
			guide => guide.id === state.dragGuideId,
		)
		state.guideLines[guideIndex].site = site
	},
	guideAdd(site) {
		const line = state.guideLines
		const type = (state.dragFlag =
			state.dragFlag === 'x'
				? 'v'
				: state.dragFlag === 'y'
				? 'h'
				: state.dragFlag)
		line.push({
			id: `${type}_${state.guideLines.length}`,
			type,
			site,
		})
		state.guideLines = line
	},
}
const ruler = store('ruler', state, actions)

export default ruler
