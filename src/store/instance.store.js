/**
 * @description 实例化对象缓存
 */

import platform from './platform.store'
import Vue from 'vue'
import { store } from './index'

const state = Vue.observable({
	kanboard: null,
	createKanboard: null,
	createComp: null,
})
const actions = {
	setInstance(key, value) {
		state[key] = value
	},
	updateComponent: (id, config) => {
		const widgetConfig = platform.state.widgetAdded[id].config.api
		if (config.params) {
			widgetConfig.params = JSON.stringify(config.params)
		}
		if (config.data) {
			widgetConfig.data = JSON.stringify(config.data)
		}
		if (config.url) {
			widgetConfig.url = config.url
		}
		if (config.path) {
			widgetConfig.path = config.path
		}
		if (config.method) {
			widgetConfig.method = config.method
		}
	},
}
const instance = store('instance', state, actions)

export default instance
