/**
 * @description 场景
 */

import Vue from 'vue'
import instance from './instance.store'
import { store } from './index'
import Editor from '@/core/Editor'

const state = Vue.observable({
	activeWidgetId: '', // 被激活的场景对应组件
	activeSceneId: 0, // 被激活的场景id
	obj: {},
	showAnimationStyle: '',
	sceneObj: {},
})
const actions = {
	// 兼容老组件后期会删除
	setSceneIndex(index) {
		Editor.setSceneIndex(index)
	},
	destroyScene(index, showAnimationStyle = 'fadeOut') {
		if (Vue.prototype.$screen.status === 'inPreview') {
			if (state.showAnimationStyle) {
				document
					.getElementById(index)
					.classList.remove(state.showAnimationStyle)
			}
			if (showAnimationStyle) {
				document.getElementById(index).classList.add(showAnimationStyle)
			}
			const event = new CustomEvent('DestroyScene', { detail: { index } })
			document.dispatchEvent(event)
			setTimeout(() => {
				state.activeSceneId = 0
				document.getElementById(index).parentNode.remove()
				instance.actions.setInstance('createKanboard', null) // 初始化实例场景
				instance.actions.setInstance('createComp', null) // 初始化实例场景
				state.showAnimationStyle = '' // 初始化实例场景
			}, 300)
		}
	},
	createSceneInstance(
		id,
		showAnimationStyle = 'fadeIn',
		pointerEvents = 'auto',
	) {
		Editor.openScene(id)
	},
}
const scene = store('scene', state, actions)

export default scene
