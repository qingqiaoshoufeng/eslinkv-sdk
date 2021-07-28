import widgetMixin from '@/vue2/mixins'
import dScreen from '@/vue2/components/d-screen/index.vue'
import dDetail from '@/vue2/components/d-detail/index.vue'
import dShareDialog from '@/vue2/components/d-share-dialog/index.vue'
import dView from '@/vue2/components/d-view/index.vue'
import loadMask from '@/vue2/components/load-mask/index.vue'
import '@/vue2/plugin.js'
import colorTheme from '@/core/colorTheme'
import widgetEcharts from '@/vue2/ui/Widget/echarts.vue'
import widgetNormal from '@/vue2/ui/Widget/normal.vue'
import { mixins } from 'vue-class-component'

const widgetNormalMixin = mixins(widgetMixin)

const eslinkV = {
	widgetNormalMixin,
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
	console.log('eslinkv vue2')
	console.log(eslinkV.widgetMixin.mounted)
	console.log(eslinkV.widgetNormalMixin)
	window.eslinkV = { ...window.eslinkV, ...eslinkV }
}

export {
	widgetNormalMixin,
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
