import platform from '../store/platform.store'
import event from '../store/event.store'
import ruler from '../store/ruler.store'
import { throttle } from 'throttle-debounce'

/**
 * @description
 * DOM : .d-dr
 * 事件： mousedown
 */
export const drMouseDown = () => {
	event.state.componentMove = true
}

/**
 * @description
 * DOM : #ruler-content
 * 事件： mousedown
 */
export const rulerContentMouseDown = e => {
	/**
	 * @description 取消选择组件
	 */
	if (!event.state.componentMove) {
		platform.actions.unChooseWidget()
	}
	// 判断是否为鼠标左键被按下
	if (e.buttons !== 1 || e.which !== 1) return
	/**
	 * @description 框选操作
	 */
	if (!event.state.contentMove && !event.state.componentDrag) {
		event.state.kuangMove = true
		event.state.startX = e.clientX
		event.state.startY = e.clientY
		let kuang = document.getElementById('d-kuang')
		if (!kuang) {
			kuang = document.createElement('div')
			kuang.style.cssText =
				'position: absolute;width: 0;height: 0;margin: 0;padding: 0;border: 1px solid rgb(36, 145, 247);background-color: rgba(0, 132, 255, 0.15);z-index: 1000;opacity: 0.6;display: none;pointer-events: none;'
			kuang.id = 'd-kuang'
			document.body.appendChild(kuang)
		}
		kuang.style.left = event.state.startX + 'px'
		kuang.style.top = event.state.startY + 'px'
	}
	/**
	 * @description 空格拖动画布面板操作
	 */
	if (event.state.contentMove) {
		event.state.contentDrag = true
	}
}

/**
 * @description
 * DOM : #ruler-content
 * 事件： mousemove
 */
export const rulerContentMouseMove = e => {
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

/**
 * @description
 * DOM : document
 * 事件： mouseup
 */
export const mouseup = e => {
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

/**
 * @description
 * DOM : document
 * 事件： keydown
 */
export const keydown = e => {
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

/**
 * @description
 * DOM : document
 * 事件： keyup
 */
export const keyup = () => {
	event.state.contentMove = false
}

/**
 * @description
 * DOM : document
 * 事件： mousemove
 */
export const mousemove = throttle(50, false, function (e) {
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
