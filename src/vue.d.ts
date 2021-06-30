import { ModalInstance } from 'view-design'
import { Route } from 'vue-router'
import { VueRouter } from 'vue-router/types/router'
declare module 'vue/types/vue' {
	interface Vue {
		$route: Route
		$router: VueRouter
		$Modal: ModalInstance
	}
}
