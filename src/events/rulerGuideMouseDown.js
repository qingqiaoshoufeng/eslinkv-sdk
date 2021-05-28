import event from '@/store/event.store'
import Vue from 'vue'

/**
 * @description
 * DOM : .d-guide-line
 * 事件： mousemove
 */
const rulerGuideMouseDown = (e, item) => {
	/**
	 * @description 参考线操作
	 */
	e.stopPropagation()
	if (e.which !== 1) return
	if (e.offsetX + e.offsetY > Vue.prototype.$ruler.size) return
	const { clientX, clientY } = e
	const { id } = item
	Vue.prototype.$ruler.guideDragStartX = clientX
	Vue.prototype.$ruler.guideDragStartY = clientY - Vue.prototype.$ruler.yRoom
	event.state.guideDrag = true
	Vue.prototype.$ruler.dragGuideId = id
}
export default rulerGuideMouseDown
