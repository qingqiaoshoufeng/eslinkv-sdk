/**
 * @description 事件
 */

import Vue from 'vue'
import { store } from './index'

const state = Vue.observable({
	func: {},
})
const actions = {
	setEvent(key, func) {
		Vue.set(state.func, key, func)
	},
}
const scene = store('event', state, actions)

export default scene
