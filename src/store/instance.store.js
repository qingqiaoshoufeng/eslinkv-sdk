/**
 * @description 实例化对象缓存
 */

import platform from './platform.store'
import Vue from 'vue'

if (!window.eslinkV) {
	window.eslinkV = {}
}

if (!window.eslinkV.$store) {
	window.eslinkV.$store = {}
}

let state, actions
if (window.eslinkV.$store.instance) {
	state = window.eslinkV.$store.instance.state
	actions = window.eslinkV.$store.instance.actions
} else {
	state = new Vue.observable({
		kanboard: null,
		createKanboard: null,
		createComp: null,
	})

	actions = {
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
	window.eslinkV.$store.instance = {state, actions}
}

export default {state, actions}
