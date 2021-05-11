import scene from '@/store/scene.store'
import event from '@/store/event.store'
import ruler from '@/store/ruler.store'
import platform from '@/store/platform.store'

/**
 * @description
 * DOM : document
 * 事件： mouseup
 */
const mouseup = e => {
	if (event.state.contentDrag) {
		event.state.contentDrag = false
	}
	if (platform.state.searchModal) {
		platform.state.searchModal = false
	}
	if (event.state.kuangMove) {
		document.getElementById('d-kuang').style.display = 'none'
		event.state.kuangMove = false
		const startPointerX = ruler.actions.getActualPointerX(
			event.state.startX,
		)
		const startPointerY = ruler.actions.getActualPointerY(
			event.state.startY,
		)
		const endPointerX = ruler.actions.getActualPointerX(e.clientX)
		const endPointerY = ruler.actions.getActualPointerY(e.clientY)
		if (startPointerX === endPointerX || startPointerY === endPointerY)
			return
		const minPointerX = Math.min(startPointerX, endPointerX)
		const minPointerY = Math.min(startPointerY, endPointerY)
		const maxPointerX = Math.max(startPointerX, endPointerX)
		const maxPointerY = Math.max(startPointerY, endPointerY)
		Object.values(platform.state.widgetAdded).forEach(v => {
			// 只能框选当前场景下的组件
			if (v.scene === scene.state.index) {
				const widgetStartX = v.config.layout.position.left
				const widgetStartY = v.config.layout.position.top
				const widgetEndX =
					v.config.layout.position.left + v.config.layout.size.width
				const widgetEndY =
					v.config.layout.position.top + v.config.layout.size.height
				if (
					minPointerX < widgetStartX &&
					widgetStartX < maxPointerX &&
					minPointerY < widgetStartY &&
					widgetStartY < maxPointerY &&
					minPointerX < widgetEndX &&
					widgetEndX < maxPointerX &&
					minPointerY < widgetEndY &&
					widgetEndY < maxPointerY
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
