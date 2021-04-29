import ruler from '@/store/ruler.store'

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
			ruler.state.contentX += e.wheelDelta > 0 ? 10 : -10
			return false
		}
		ruler.state.contentY += e.wheelDelta > 0 ? 10 : -10
	}
}
export default rulerContentWheel
