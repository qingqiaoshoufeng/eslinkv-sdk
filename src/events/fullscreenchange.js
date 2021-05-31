import Vue from 'vue'

/**
 * @description
 * DOM : document
 * 事件： keydown
 */
const fullscreenchange = () => {
	Vue.prototype.$screen.fullscreen = !Vue.prototype.$screen.fullscreen
}
export default fullscreenchange
