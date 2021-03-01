/**
 * @description 挂载业务组件
 */

import Vue from 'vue'

if (!window.eslinkV) {
	window.eslinkV = {}
}

if (!window.eslinkV.$store) {
	window.eslinkV.$store = {}
}

let state, actions
if (window.eslinkV.$store.custom) {
	state = window.eslinkV.$store.custom.state
	actions = window.eslinkV.$store.custom.actions
} else {
	state = new Vue.observable({
		widgets: {},
		components: {}
	})
	actions = {
		setCustomComponents(value) {
			state.components = {...state.components, ...value}
		},
		setCustomWidgets(value) {
			state.widgets[`d-${+new Date()}`] = value
		}
	}
	window.eslinkV.$store.custom = {state, actions}
}

export default {state, actions}
