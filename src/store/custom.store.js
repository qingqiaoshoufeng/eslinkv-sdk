/**
 * @description 挂载业务组件
 */

import Vue from 'vue'
import { store } from './index'

const state = Vue.observable({
	widgets: {},
	components: {}
})
const actions = {
	setCustomComponents (value) {
		state.components = { ...state.components, ...value }
	},
	setCustomWidgets (value) {
		state.widgets = { ...value, ...state.widgets }
	}
}
const custom = store('custom', state, actions)

export default custom
