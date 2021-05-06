import ruler from '@/store/ruler.store'
import event from '@/store/event.store'

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
	if (e.offsetX + e.offsetY > ruler.state.size) return
	const { clientX, clientY } = e
	const { id } = item
	ruler.state.guideDragStartX = clientX
	ruler.state.guideDragStartY = clientY - ruler.state.yRoom
	event.state.guideDrag = true
	ruler.state.dragGuideId = id
}
export default rulerGuideMouseDown
