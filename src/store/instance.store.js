/**
 * @description 实例化对象缓存
 */

import Vue from 'vue'
import { store } from './index'

const state = Vue.observable({
	kanboard: null,
	createKanboard: null,
})
const actions = {
	setInstance(key, value) {
		state[key] = value
	},
	updateComponentTarget: (id, target, value) => {
		switch (target) {
			case 'config.api.params':
				Vue.prototype.$screen.screenWidgets[id].config.api.params = {
					...Vue.prototype.$screen.screenWidgets[id].config.api
						.params,
					...value,
				}
				break
			case 'config.api.data':
				Vue.prototype.$screen.screenWidgets[id].config.api.data = value
				break
			case 'config.config':
				Vue.prototype.$screen.screenWidgets[id].config.config = {
					...Vue.prototype.$screen.screenWidgets[id].config.config,
					...value,
				}
				break
		}
	},
	updateComponent: (id, config) => {
		const widgetConfig = Vue.prototype.$screen.screenWidgets[id].config.api
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
