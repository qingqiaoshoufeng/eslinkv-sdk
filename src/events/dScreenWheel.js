import ruler from '@/store/ruler.store'

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
			ruler.actions.zoomIn()
		} else {
			ruler.actions.zoomOut()
		}
		return false
	}
}
export default dScreenWheel
