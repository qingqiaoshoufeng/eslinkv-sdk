/**
 * @description 挂载业务组件
 */

import Vue from 'vue'
import {store} from './index'

const state = new Vue.observable({
	widgets: {},
	components: {}
})
const actions = {
	setCustomComponents(value) {
		state.components = {...state.components, ...value}
	},
	setCustomWidgets(value) {
		state.widgets[`d-${+new Date()}`] = value
	}
}
const custom = store('custom', state, actions)

export default custom
