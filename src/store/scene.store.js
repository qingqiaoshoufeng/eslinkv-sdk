/**
 * @description 场景
 */

import Vue from 'vue'
import { store } from './index'
import Editor from '@/core/Editor'

const state = Vue.observable({
	activeWidgetId: '', // 被激活的场景对应组件
	activeSceneId: 0, // 被激活的场景id
	showAnimationStyle: '',
})
const actions = {
	// 兼容老组件后期会删除
	setSceneIndex(index) {
		Editor.selectSceneIndex(index)
	},
	destroyScene(index, showAnimationStyle = 'fadeOut') {
		Editor.closeScene(index)
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
