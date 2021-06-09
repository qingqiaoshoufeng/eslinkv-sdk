import { ModalInstance } from 'view-design'
import { Route } from 'vue-router'

declare module 'vue/types/vue' {
	interface Vue {
		$route: Route
		$Modal: ModalInstance
	}
}
