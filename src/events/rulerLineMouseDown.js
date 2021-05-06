import ruler from '@/store/ruler.store'
import event from '@/store/event.store'

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
	if (ruler.state.dragGuideId) {
		ruler.actions.changeGuideLine(type)
	} else {
		ruler.actions.guideAdd(type)
	}
	// START_PROD
	if (id) {
		this.$api.screenShare.screenShareUpdate({
			screenId: id,
			screenGuide: this.ruler.guideLines,
		})
	}
	// END_PROD
	event.state.guideDrag = false
	ruler.state.dragGuideId = ''
}
export default rulerLineMouseDown
