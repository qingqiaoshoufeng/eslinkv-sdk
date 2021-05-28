import Vue from 'vue'

/**
 * @description
 * DOM : document
 * 事件： keydown
 */
const rulerContentWheel = e => {
	if (!e.ctrlKey) {
		e.preventDefault()
		e.stopPropagation()
		if (e.shiftKey) {
			Vue.prototype.$ruler.contentX += e.wheelDelta > 0 ? 10 : -10
			return false
		}
		Vue.prototype.$ruler.contentY += e.wheelDelta > 0 ? 10 : -10
	}
}
export default rulerContentWheel
