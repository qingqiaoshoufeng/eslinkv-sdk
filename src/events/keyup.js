import event from '@/store/event.store'
import Vue from 'vue'

/**
 * @description
 * DOM : document
 * 事件： keyup
 */
const keyup = e => {
	event.state.contentMove = false
	// if (e.keyCode === 8 || e.keyCode === 46) {
	// 	if (!Vue.prototype.$screen.chooseWidgetId || event.state.inputFocus) return
	// 	Vue.prototype.$Modal.confirm({
	// 		title: '提示',
	// 		content: '是否删除当前组件？',
	// 		onOk: () => {
	// 			const id = Vue.prototype.$screen.chooseWidgetId
	// 			Vue.delete(Vue.prototype.$screen.screenWidgets, id)
	// 			Vue.prototype.$screen.unChooseWidget()
	// 		},
	// 	})
	// }
}
export default keyup
