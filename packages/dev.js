import widgetMixin from '../mixins'
import { configMerge } from '../src/utils'
import dEditor from '../src/components/d-editor/index.vue'
import platform from '../src/store/platform.store.js'
import commonConfigValue from '../common-config-value.js'
import dLeftWidget from '../src/components/d-left-widget/index.vue'
import dScreen from '../src/components/d-screen/index.vue'
import dLeftScene from '../src/components/d-left-scene/index.vue'
import dRightManage from '../src/components/d-right-manage/index.vue'
import dRightSetting from '../src/components/d-right-setting/index.vue'
import dDetail from '../src/components/d-detail/index.vue'
import dFooter from '../src/components/d-footer/index.vue'
import scene from '../src/store/scene.store'
import instance from '../src/store/instance.store'
import custom from '../src/store/custom.store'
import event from '../src/store/event.store.js'
import dView from '../src/components/d-view/index.vue'
import loadMask from '../src/components/load-mask/index.vue'
import '../src/plugins'
import market from '../src/plugins/market.ts'
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
	configMerge,
	commonConfigValue,
	market,
	dEditor,
	dScreen,
	dLeftWidget,
	dLeftScene,
	dRightSetting,
	dRightManage,
	dDetail,
	dFooter,
	dView,
	loadMask,
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
	configMerge,
	commonConfigValue,
	market,
	dEditor,
	dScreen,
	dLeftWidget,
	dLeftScene,
	dRightSetting,
	dRightManage,
	dDetail,
	dFooter,
	dView,
	loadMask,
}
export default eslinkV
