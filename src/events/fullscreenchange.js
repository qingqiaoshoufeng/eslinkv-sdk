import platform from '@/store/platform.store'

/**
 * @description
 * DOM : document
 * 事件： keydown
 */
const fullscreenchange = () => {
	platform.state.fullscreen = !platform.state.fullscreen
}
export default fullscreenchange
