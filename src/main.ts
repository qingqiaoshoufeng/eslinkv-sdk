import Vue from 'vue'
import App from './App.vue'
import { Message, Modal } from 'view-design'
import router from './router'
import '@babel/polyfill'
import '@/vue2/plugin.js'
import '@/demo/components-business'
import widgetMixin from '@/vue2/mixins'
window.eslinkV.widgetMixin = widgetMixin

Vue.prototype.$Message = Message
Vue.prototype.$Modal = Modal
Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App),
}).$mount('#app')
