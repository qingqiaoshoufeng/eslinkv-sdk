import scene from '@/store/scene.store'
import event from '@/store/event.store'
import ruler from '@/store/ruler.store'
import platform from '@/store/platform.store'

/**
 * @description
 * DOM : document
 * 事件： mouseup
 */
const mouseup = (e) => {
	if (event.state.contentDrag) {
		event.state.contentDrag = false
	}
	if (event.state.kuangMove) {
		document.getElementById('d-kuang').style.display = 'none'
		event.state.kuangMove = false
		const startPointerX = ruler.actions.getActualPointerX(event.state.startX)
		const startPointerY = ruler.actions.getActualPointerY(event.state.startY)
		const endPointerX = ruler.actions.getActualPointerX(e.clientX)
		const endPointerY = ruler.actions.getActualPointerY(e.clientY)
		Object.values(platform.state.widgetAdded).forEach(v => {
			// 只能框选当前场景下的组件
			if (v.scene === scene.state.index) {
				if (
					v.config.layout.position.left >= startPointerX
					&& v.config.layout.position.top >= startPointerY
					&& v.config.layout.position.left + v.config.layout.size.width <= endPointerX
					&& v.config.layout.position.top + v.config.layout.size.height <= endPointerY
				) {
					platform.state.chooseWidgetId = v.id
					platform.state.chooseWidgetState = false
				}
			}
		})
	}
	if (event.state.componentMove) {
		event.state.componentMove = false
	}
}
export default mouseup
