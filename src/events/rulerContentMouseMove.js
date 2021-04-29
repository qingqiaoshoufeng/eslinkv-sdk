import event from '@/store/event.store'

/**
 * @description
 * DOM : #ruler-content
 * 事件： mousemove
 */
const rulerContentMouseMove = e => {
	/**
	 * @description 框选操作
	 */
	if (event.state.kuangMove) {
		e.stopPropagation()
		const _x = e.clientX
		const _y = e.clientY
		const selDiv = document.getElementById('d-kuang')
		selDiv.style.display = 'block'
		selDiv.style.left = Math.min(_x, event.state.startX) + 'px'
		selDiv.style.top = Math.min(_y, event.state.startY) + 'px'
		selDiv.style.width = Math.abs(_x - event.state.startX) + 'px'
		selDiv.style.height = Math.abs(_y - event.state.startY) + 'px'
	}
}
export default rulerContentMouseMove
