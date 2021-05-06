import event from '@/store/event.store'

/**
 * @description
 * DOM : document
 * 事件： keydown
 */
const keydown = e => {
	if (
		(e.ctrlKey === true || e.metaKey === true) &&
		(e.which === 189 ||
			e.which === 187 ||
			e.which === 173 ||
			e.which === 61 ||
			e.which === 107 ||
			e.which === 109)
	) {
		e.preventDefault()
	}
	if (e.keyCode === 32) {
		event.state.contentMove = true
	}
}
export default keydown
