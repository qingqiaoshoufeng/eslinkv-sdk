import '@/vue2/icons'
import 'view-design/dist/styles/iview.css'
import '@/vue2/scss/conf.scss'
import '@/vue2/scss/reset.scss'
import '@/vue2/scss/index.scss'
import '@/vue2/scss/animate.min.scss'
import '@/vue2/scss/animate-widget.min.scss'
import '@/vue2/scss/font.scss'
import Vue from 'vue'

import group from '@/vue2/components-base/d-widget-group'
import widgetGroup from '@/vue2/components-base/d-left-scene/widget-group'
import widget from '@/vue2/components-base/d-widget'
Vue.component('scene-group', widgetGroup)
Vue.component('eslinkv-group', group)
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
