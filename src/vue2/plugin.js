import '@/vue2/api'
import '@/vue2/icons'
import 'view-design/dist/styles/iview.css'
import '@/vue2/scss/conf.scss'
import '@/vue2/scss/reset.scss'
import '@/vue2/scss/index.scss'
import '@/vue2/scss/animate.min.scss'
import '@/vue2/scss/animate-widget.min.scss'
import '@/vue2/scss/font.scss'
import Vue from 'vue'
import Hljs from 'highlight.js'
import 'highlight.js/styles/tomorrow-night.css'
import group from '@/vue2/components/d-widget-group'
import normal from '@/vue2/components/d-widget-normal'
Vue.component('eslinkv-group', group)
Vue.component('eslinkv-normal', normal)
const Highlight = {
	install: function (Vue) {
		Vue.directive('highlight', {
			deep: true,
			inserted: function (el) {
				const blocks = el.querySelectorAll('pre code')
				for (let i = 0; i < blocks.length; i++) {
					Hljs.highlightBlock(blocks[i])
				}
			},
			componentUpdated: function (el) {
				const blocks = el.querySelectorAll('pre code')
				for (let i = 0; i < blocks.length; i++) {
					Hljs.highlightBlock(blocks[i])
				}
			},
		})
	},
}

const toThousand = value => {
	if (!value) {
		if (typeof value === 'number') return 0
		return ''
	} else {
		return Number(Math.ceil(value)).toLocaleString()
	}
}
const filters = { toThousand }

Vue.use(Highlight)
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))
