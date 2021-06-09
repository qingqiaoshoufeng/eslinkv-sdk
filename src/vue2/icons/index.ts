import Vue from 'vue'
import dSvg from '../components/d-icon/index.vue'

Vue.component('d-svg', dSvg)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
