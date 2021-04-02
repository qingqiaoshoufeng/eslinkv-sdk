/**
 * @description 权限信息
 */

import Vue from 'vue'
import { store } from './index'

const state = Vue.observable({
	buildMode: process.env.VUE_APP_BUILD_MODE,
})
const actions = {}
const power = store('power', state, actions)

export default power
