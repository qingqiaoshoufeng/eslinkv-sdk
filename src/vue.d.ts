import { ModalInstance } from 'view-design'
import { Route } from 'vue-router'

declare module 'vue/types/vue' {
	interface Vue {
		$api: any
		$ruler: any
		$route: Route
		$screen: any
		$Modal: ModalInstance
	}
}
