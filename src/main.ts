import Vue from 'vue'
import App from './App.vue'
import {Message, Modal, Switch, Select, Option, Icon} from 'view-design'
import router from './router'
import '@babel/polyfill'
import '../index.js'

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