import Vue, { VNode } from 'vue'
import VueRouter, { Route } from 'vue-router'

declare module '*.vue' {
	export default Vue
}

declare global {
	namespace JSX {
		interface Element extends VNode {}
		interface ElementClass extends Vue {}
		interface IntrinsicElements {
			[elem: string]: any
		}
	}
}

declare module 'vue/types' {
	interface Vue {
		$route: Route
		$router: VueRouter
	}
}
