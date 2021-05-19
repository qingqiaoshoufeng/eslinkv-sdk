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
		platform.state.chooseWidgetArray = []
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
					platform.state.chooseWidgetArray = [
						...platform.state.chooseWidgetArray,
						v.id,
					]
				}
			}
		})
		let minLeft = null,
			maxLeft = null,
			width = 0,
			height = 0,
			minTop = null,
			maxTop = null
		if (platform.state.chooseWidgetArray.length === 1) {
			platform.state.chooseWidgetId = platform.state.chooseWidgetArray[0]
			platform.state.chooseWidgetArray = []
		} else {
			platform.state.chooseWidgetArray.map(item => {
				const m = platform.state.widgetAdded[item]
				if (minLeft === null) {
					minLeft = m.config.layout.position.left
				}
				if (maxLeft === null) {
					maxLeft = m.config.layout.position.left
					width = m.config.layout.size.width
				}
				if (minTop === null) {
					minTop = m.config.layout.position.top
				}
				if (maxTop === null) {
					maxTop = m.config.layout.position.top
					height = m.config.layout.size.height
				}
				if (minLeft > m.config.layout.position.left)
					minLeft = m.config.layout.position.left
				if (maxLeft < m.config.layout.position.left) {
					maxLeft = m.config.layout.position.left
					width = m.config.layout.size.width
				}
				if (minTop > m.config.layout.position.top)
					minTop = m.config.layout.position.top
				if (maxTop < m.config.layout.position.top) {
					maxTop = m.config.layout.position.top
					height = m.config.layout.size.height
				}
			})
			platform.state.chooseWidgetArrayConfig.left = minLeft
			platform.state.chooseWidgetArrayConfig.top = minTop
			platform.state.chooseWidgetArrayConfig.width =
				width + (maxLeft - minLeft)
			platform.state.chooseWidgetArrayConfig.height =
				height + (maxTop - minTop)
		}
	}
	if (event.state.componentMove) {
		event.state.componentMove = false
	}
}
export default mouseup
