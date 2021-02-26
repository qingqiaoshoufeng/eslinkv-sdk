import platform from './platform.store'
import Vue from 'vue'

/**
 * @description 实例化对象缓存
 */
const state = new Vue.observable({
	kanboard: null,
	createKanboard: null,
	createComp: null,
})

const actions = {
	setInstance(key, value) {
		state[key] = value
	},
	updateComponent: (id, config) => {
		const widgetConfig = platform.actions.widgetAdded[id].config.api
		if (config.params) {
			widgetConfig.params = JSON.stringify(config.params)
		}
		if (config.data) {
			widgetConfig.data = JSON.stringify(config.data)
		}
		if (config.url)
			widgetConfig.url = config.url
		if (config.path)
			widgetConfig.path = config.path
		if (config.method)
			widgetConfig.method = config.method
	}
}

export default {state, actions}
