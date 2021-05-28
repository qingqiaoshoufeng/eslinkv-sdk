import event from '@/store/event.store'
import Vue from 'vue'

/**
 * @description
 * DOM : .d-ruler-wrapper-y .d-ruler-wrapper-x
 * 事件： mousemove
 */
const rulerLineMouseDown = (e, type, id) => {
	/**
	 * @description 标尺操作
	 */
	e.stopPropagation()
	if (Vue.prototype.$ruler.dragGuideId) {
		Vue.prototype.$ruler.changeGuideLine(type)
	} else {
		Vue.prototype.$ruler.guideCreate(type)
	}
	// todo
	// if (id) {
	// 	this.$api.screenShare.screenShareUpdate({
	// 		screenId: id,
	// 		screenGuide: this.ruler.guideLines,
	// 	})
	// }
	event.state.guideDrag = false
	Vue.prototype.$ruler.dragGuideId = ''
}
export default rulerLineMouseDown
