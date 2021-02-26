import Vue from 'vue'

/**
 * @description 权限信息
 */
const state = new Vue.observable({
	buildMode: process.env.VUE_APP_BUILD_MODE
})

const actions = {}

export default {state, actions}
