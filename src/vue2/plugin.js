import '@/vue2/icons'
import 'view-design/dist/styles/iview.css'
import '@/vue2/scss/conf.scss'
import '@/vue2/scss/reset.scss'
import '@/vue2/scss/index.scss'
import '@/vue2/scss/animate.min.scss'
import '@/vue2/scss/animate-widget.min.scss'
import '@/vue2/scss/font.scss'
import Vue from 'vue'

import sceneGroup from '@/vue2/components-base/d-left-scene/widget-group'
import widgetGroup from '@/vue2/components-base/d-widget/group.vue'
import widgetNormal from '@/vue2/components-base/d-widget/normal.vue'
import widget from '@/vue2/components-base/d-widget/index.vue'
Vue.component('scene-group', sceneGroup)
Vue.component('eslinkv-group', widgetGroup)
Vue.component('eslinkv-normal', widgetNormal)
Vue.component('eslinkv-widget', widget)

const toThousand = value => {
	if (!value) {
		if (typeof value === 'number') return 0
		return ''
	} else {
		return Number(Math.ceil(value)).toLocaleString()
	}
}
const filters = { toThousand }

Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))
