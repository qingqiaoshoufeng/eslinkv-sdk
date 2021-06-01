import scene from '@/store/scene.store'
import event from '@/store/event.store'
import Vue from 'vue'

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
		const startPointerX = Vue.prototype.$ruler.getActualPointerX(
			event.state.startX,
		)
		const startPointerY = Vue.prototype.$ruler.getActualPointerY(
			event.state.startY,
		)
		const endPointerX = Vue.prototype.$ruler.getActualPointerX(e.clientX)
		const endPointerY = Vue.prototype.$ruler.getActualPointerY(e.clientY)
		if (startPointerX === endPointerX || startPointerY === endPointerY)
			return
		const minPointerX = Math.min(startPointerX, endPointerX)
		const minPointerY = Math.min(startPointerY, endPointerY)
		const maxPointerX = Math.max(startPointerX, endPointerX)
		const maxPointerY = Math.max(startPointerY, endPointerY)
		Vue.prototype.$screen.chooseWidgetArray = []
		Object.values(Vue.prototype.$screen.screenWidgets).forEach(v => {
			// 只能框选当前场景下的组件
			if (v.scene === Vue.prototype.$screen.sceneIndex) {
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
					Vue.prototype.$screen.chooseWidgetArray = [
						...Vue.prototype.$screen.chooseWidgetArray,
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
		if (Vue.prototype.$screen.chooseWidgetArray.length === 1) {
			Vue.prototype.$screen.chooseWidgetId =
				Vue.prototype.$screen.chooseWidgetArray[0]
			Vue.prototype.$screen.chooseWidgetArray = []
		} else {
			Vue.prototype.$screen.chooseWidgetArray.map(item => {
				const m = Vue.prototype.$screen.screenWidgets[item]
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
			Vue.prototype.$screen.chooseWidgetArrayConfig.left = minLeft
			Vue.prototype.$screen.chooseWidgetArrayConfig.top = minTop
			Vue.prototype.$screen.chooseWidgetArrayConfig.width =
				width + (maxLeft - minLeft)
			Vue.prototype.$screen.chooseWidgetArrayConfig.height =
				height + (maxTop - minTop)
		}
	}
	if (event.state.componentMove) {
		event.state.componentMove = false
	}
}
export default mouseup
