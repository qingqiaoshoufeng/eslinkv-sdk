import event from '@/store/event.store'

/**
 * @description
 * DOM : document
 * 事件： keyup
 */
const keyup = () => {
	event.state.contentMove = false
}
export default keyup
