import event from '@/store/event.store'

/**
 * @description
 * DOM : .d-dr
 * 事件： mousedown
 */
const dDrMouseDown = () => {
	event.state.componentMove = true
}
export default dDrMouseDown
