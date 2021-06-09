import widgetMixin from './mixins'
import dScreen from './components/d-screen/index.vue'
import dDetail from './components/d-detail/index.vue'
import dView from '../src/components/d-view/index.vue'
import loadMask from '../src/components/load-mask/index.vue'
import commonConfigValue from '@/core/common-config-value.js'
import './plugin.js'
import colorTheme from '@/core/colorTheme'

const eslinkV = {
	widgetMixin,
	colorTheme,
	dScreen,
	dDetail,
	dView,
	loadMask,
	commonConfigValue,
}
if (window !== undefined) {
	if (!window.eslinkV) {
		window.eslinkV = {}
	}
	window.eslinkV = { ...window.eslinkV, ...eslinkV }
}

export {
	widgetMixin,
	colorTheme,
	dScreen,
	dDetail,
	dView,
	loadMask,
	commonConfigValue,
}
export default eslinkV
