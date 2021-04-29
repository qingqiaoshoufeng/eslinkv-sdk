import event from '@/store/event.store'

/**
 * @description
 * DOM : document
 * 事件： mouseup
 */
const mouseup = () => {
	if (event.state.contentDrag) {
		event.state.contentDrag = false
	}
	if (event.state.kuangMove) {
		const selDiv = document.getElementById('d-kuang')
		selDiv.style.display = 'none'
		event.state.kuangMove = false
	}
	if (event.state.componentMove) {
		event.state.componentMove = false
	}
}
export default mouseup
