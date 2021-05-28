import event from '@/store/event.store'
import Vue from 'vue'

/**
 * @description
 * DOM : .d-ruler-wrapper-y .d-ruler-wrapper-x
 * 事件： mousemove
 */
const rulerLineMouseUp = (e, type, id) => {
	/**
	 * @description 标尺操作
	 */
	e.stopPropagation()
	if (event.state.guideDrag) {
		Vue.prototype.$ruler.changeGuideLine(type)
		event.state.guideDrag = false
		Vue.prototype.$ruler.dragGuideId = ''
		// todo
		// if (id) {
		// 	this.$api.screenShare.screenShareUpdate({
		// 		screenId: id,
		// 		screenGuide: Vue.prototype.$ruler.guideLines,
		// 	})
		// }
	}
}
export default rulerLineMouseUp
