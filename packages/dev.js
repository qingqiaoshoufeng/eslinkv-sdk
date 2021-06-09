import widgetMixin from '../mixins'
import dEditor from '../src/components/d-editor/index.vue'
import dScreen from '../src/components/d-screen/index.vue'
import dDetail from '../src/components/d-detail/index.vue'
import dFooter from '../src/components/d-footer/index.vue'
import scene from '../src/store/scene.store'
import instance from '../src/store/instance.store'
import dView from '../src/components/d-view/index.vue'
import loadMask from '../src/components/load-mask/index.vue'
import commonConfigValue from '../common-config-value.js'
import { configMerge } from '../src/utils'
import './plugin.js'
import { colorTheme } from './config.default'
import Editor from '../src/core/Editor/index.ts'

const eslinkV = {
	Editor,
	widgetMixin,
	scene,
	instance,
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
	Editor,
	widgetMixin,
	scene,
	instance,
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
