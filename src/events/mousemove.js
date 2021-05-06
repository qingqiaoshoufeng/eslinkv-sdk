import { throttle } from 'throttle-debounce'
import event from '@/store/event.store'
import ruler from '@/store/ruler.store'

/**
 * @description
 * DOM : document
 * 事件： mousemove
 */
const mousemove = throttle(50, false, function (e) {
	const { clientX, clientY } = e
	event.state.clientX = clientX
	event.state.clientY = clientY
	if (event.state.contentDrag) {
		if (!event.state.startX) {
			event.state.clientX = clientX
			event.state.clientY = clientY
		}
		ruler.state.contentScrollLeft = Math.ceil(clientX - event.state.startX)
		ruler.state.contentScrollTop = Math.ceil(clientY - event.state.startY)
		event.state.startX = clientX
		event.state.startY = clientY
	}
})
export default mousemove
