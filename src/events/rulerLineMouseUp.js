import ruler from '@/store/ruler.store'
import event from '@/store/event.store'

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
		ruler.actions.changeGuideLine(type)
		event.state.guideDrag = false
		ruler.state.dragGuideId = ''
		// START_PROD
		if (id) {
			this.$api.screenShare.screenShareUpdate({
				screenId: id,
				screenGuide: this.ruler.guideLines,
			})
		}
		// END_PROD
	}
}
export default rulerLineMouseUp
