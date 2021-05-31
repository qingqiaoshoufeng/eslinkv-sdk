import event from '@/store/event.store'
import platform from '@/store/platform.store'

/**
 * @description
 * DOM : #ruler-content
 * 事件： mousedown
 */
const rulerContentMouseDown = e => {
	/**
	 * @description 取消选择组件
	 */
	if (!event.state.componentMove) {
		platform.actions.unChooseWidget()
	}
	// 判断是否为鼠标左键被按下
	if (e.buttons !== 1 || e.which !== 1) return
	event.state.startX = e.clientX
	event.state.startY = e.clientY
	/**
	 * @description 框选操作
	 */
	if (
		!event.state.contentMove &&
		!event.state.componentDrag &&
		!event.state.componentMove
	) {
		event.state.kuangMove = true
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
export default rulerContentMouseDown
