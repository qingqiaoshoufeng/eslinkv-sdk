import Vue from 'vue'

/**
 * @description
 * DOM : #d-screen
 * 事件： wheel
 */
const dScreenWheel = e => {
	if (e.ctrlKey) {
		e.preventDefault()
		e.stopPropagation()
		if (e.wheelDelta > 0) {
			Vue.prototype.$ruler.zoomIn()
		} else {
			Vue.prototype.$ruler.zoomOut()
		}
		return false
	}
}
export default dScreenWheel
