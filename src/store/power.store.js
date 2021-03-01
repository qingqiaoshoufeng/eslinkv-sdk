/**
 * @description 权限信息
 */

import Vue from 'vue'

if (!window.eslinkV) {
	window.eslinkV = {}
}

if (!window.eslinkV.$store) {
	window.eslinkV.$store = {}
}
let state, actions
if (window.eslinkV.$store.power) {
	state = window.eslinkV.$store.power.state
	actions = window.eslinkV.$store.power.actions
} else {
	state = new Vue.observable({
		buildMode: process.env.VUE_APP_BUILD_MODE
	})

	actions = {}
	window.eslinkV.$store.power = {state, actions}
}


export default {state, actions}
