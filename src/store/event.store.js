/**
 * @description 事件
 */

import Vue from 'vue'
import { store } from './index'

const state = Vue.observable({
	func: {},
	contentMove: false, // 是否按下了 空格 键，启动内容区拖动
	guideDrag: false, // 点击拖拽参考线
	componentDrag: false, // 组件拖拽
	kuangMove: false, // 框选
	startX: 0,
	startY: 0,
})
const actions = {
	setEvent(key, func) {
		Vue.set(state.func, key, func)
	},
}
const scene = store('event', state, actions)

export default scene
