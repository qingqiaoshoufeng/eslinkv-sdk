import widgetMixin from '../mixins'
import dEditor from '../src/components/d-editor/index.vue'
import platform from '../src/store/platform.store.js'
import dScreen from '../src/components/d-screen/index.vue'
import dDetail from '../src/components/d-detail/index.vue'
import dFooter from '../src/components/d-footer/index.vue'
import scene from '../src/store/scene.store'
import instance from '../src/store/instance.store'
import custom from '../src/store/custom.store'
import event from '../src/store/event.store.js'
import dView from '../src/components/d-view/index.vue'
import loadMask from '../src/components/load-mask/index.vue'
import commonConfigValue from '../common-config-value.js'
import { configMerge } from '../src/utils'
import '../src/plugins'
import './plugin.js'
import { colorTheme } from './config.default'

const eslinkV = {
	widgetMixin,
	platform,
	scene,
	instance,
	custom,
	event,
	colorTheme,
	dEditor,
	dScreen,
	dDetail,
	dFooter,
	dView,
	loadMask,
	commonConfigValue,
	configMerge,
}
if (window !== undefined) {
	if (!window.eslinkV) {
		window.eslinkV = {}
	}
	window.eslinkV = { ...window.eslinkV, ...eslinkV }
}

export {
	widgetMixin,
	platform,
	scene,
	instance,
	custom,
	event,
	colorTheme,
	dEditor,
	dScreen,
	dDetail,
	dFooter,
	dView,
	loadMask,
	commonConfigValue,
	configMerge,
}
export default eslinkV
