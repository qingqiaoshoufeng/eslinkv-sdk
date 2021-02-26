import Vue from 'vue'
import App from './App.vue'
import {Message, Modal, Switch, Select, Option, Icon} from 'view-design'
import router from './router'
import 'view-design/dist/styles/iview.css'
import './scss/reset.scss'
import './scss/index.scss'
import './api/index'
import './icons'
import '@babel/polyfill'
import './plugins'

Vue.component('iSwitch', Switch)
Vue.component('iSelect', Select)
Vue.component('iOption', Option)
Vue.component('iIcon', Icon)

Vue.prototype.$Message = Message
Vue.prototype.$Modal = Modal
Vue.config.productionTip = false


new Vue({
	router,
	render: (h) => h(App),
}).$mount('#app')
