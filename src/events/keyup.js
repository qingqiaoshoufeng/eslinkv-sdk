import platform from '@/store/platform.store'
import event from '@/store/event.store'
import { Modal } from 'view-design'
import Vue from 'vue'

/**
 * @description
 * DOM : document
 * 事件： keyup
 */
const keyup = e => {
	event.state.contentMove = false
	if (e.keyCode === 8 || e.keyCode === 46) {
		if (!platform.state.chooseWidgetId || event.state.inputFocus) return
		Modal.confirm({
			title: '提示',
			content: '是否删除当前组件？',
			onOk: () => {
				const id = platform.state.chooseWidgetId
				Vue.delete(platform.state.widgetAdded, id)
				platform.actions.unChooseWidget()
			},
		})
	}
}
export default keyup
