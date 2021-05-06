import Vue from 'vue'
import { configMerge } from '../utils'
const context = require.context('/', false, /\.(api.js)$/)
const apis = {}
context.keys().forEach(name => {
	const key = name.replace(/^\.\//, '').replace(/\.(api.js)$/, '')
	if (context(name).default) {
		apis[key] = context(name).default
	} else {
		apis[key] = context(name)
	}
})

if (Vue.prototype.$api) {
	Vue.prototype.$api = configMerge(apis, Vue.prototype.$api)
} else {
	Vue.prototype.$api = apis
}
