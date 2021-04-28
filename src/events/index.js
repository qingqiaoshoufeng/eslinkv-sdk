import platform from '../store/platform.store'
import event from '../store/event.store'

/**
 * @description
 * DOM : #d-editor
 * 事件： mousedown
 */
export const dEditorMouseDown = e => {
	/**
	 * @description 取消选择组件
	 */
	platform.actions.unChooseWidget()
	// 判断是否为鼠标左键被按下
	if (e.buttons !== 1 || e.which !== 1) return
	if (event.state.contentMove) return
	if (event.state.componentDrag) return
	/**
	 * @description 框选操作
	 */
	event.state.kuangMove = true
	event.state.startX = e.clientX
	event.state.startY = e.clientY
	const kuang = document.createElement('div')
	kuang.style.cssText =
		'position: absolute;width: 0;height: 0;margin: 0;padding: 0;border: 1px solid rgb(36, 145, 247);background-color: rgba(0, 132, 255, 0.15);z-index: 1000;opacity: 0.6;display: none;pointer-events: none;'
	kuang.id = 'd-kuang'
	document.body.appendChild(kuang)
	kuang.style.left = event.state.startX + 'px'
	kuang.style.top = event.state.startY + 'px'
}

/**
 * @description
 * DOM : #d-editor
 * 事件： mousemove
 */
export const dEditorMouseMove = e => {
	/**
	 * @description 框选操作
	 */
	if (!event.state.kuangMove) return
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
