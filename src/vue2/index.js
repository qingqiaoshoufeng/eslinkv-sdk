import widgetMixin from './mixins'
import dScreen from './components/d-screen/index.vue'
import dDetail from './components/d-detail/index.vue'
import dShareDialog from './components/d-share-dialog/index.vue'
import dView from './components/d-view/index.vue'
import loadMask from './components/load-mask/index.vue'
import './plugin.js'
import colorTheme from '@/core/colorTheme'
import widgetEcharts from '@/vue2/ui/Widget/echarts'
import widgetNormal from '@/vue2/ui/Widget/normal'

const eslinkV = {
	widgetMixin,
	widgetEcharts,
	widgetNormal,
	colorTheme,
	dScreen,
	dShareDialog,
	dDetail,
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
	widgetEcharts,
	widgetNormal,
	colorTheme,
	dScreen,
	dDetail,
	dShareDialog,
	dView,
	loadMask,
}
export default eslinkV
