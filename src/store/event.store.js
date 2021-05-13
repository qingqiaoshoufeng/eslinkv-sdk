/**
 * @description 事件
 */

import Vue from 'vue'
import { store } from './index'

const state = Vue.observable({
	func: {},
	componentsDisabled: {}, // 组件事件屏蔽
	contentMove: false, // 是否按下了 空格 键，启动内容区拖动
	contentDrag: false, // 是否按下了 空格 键，之后按下了左键
	guideDrag: false, // 点击拖拽参考线
	componentMove: false, // 组件点击开始拖拽
	componentDrag: false, // 组件拖拽中
	kuangMove: false, // 框选
	inputFocus: false, // 输入框在输入中
	startX: 0,
	startY: 0,
	clientX: 0,
	clientY: 0,
})
const actions = {
	setEvent(key, func) {
		Vue.set(state.func, key, func)
	},
}
const scene = store('event', state, actions)

export default scene
