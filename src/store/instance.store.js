/**
 * @description 实例化对象缓存
 */

import platform from './platform.store'
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
				platform.state.widgetAdded[id].config.api.params = {
					...platform.state.widgetAdded[id].config.api.params,
					...value,
				}
				break
			case 'config.api.data':
				platform.state.widgetAdded[id].config.api.data = value
				break
			case 'config.config':
				platform.state.widgetAdded[id].config.config = {
					...platform.state.widgetAdded[id].config.config,
					...value,
				}
				break
		}
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
