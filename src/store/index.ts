import Vue from 'vue'

let state: any = {}, mutations: any = {}
const list = require.context('./', true, /\.(store.js)$/)
list.keys().forEach(name => {
	const title = name.split('.')[1].replace('/', '')
	if (!list(name).default) {
		console.log(name)
		return
	}
	state[title] = list(name).default.state
	mutations = {...mutations,...list(name).default.actions}
})
const store = Vue.observable(state)
export {mutations, store}
