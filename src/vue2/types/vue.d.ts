import Vue, { VNode } from 'vue'

declare module '*.vue' {
	import Vue from 'vue'
	export default Vue
}

declare global {
	namespace JSX {
		// tslint:disable no-empty-interface
		interface Element extends VNode {}
		// tslint:disable no-empty-interface
		interface ElementClass extends Vue {}
		interface IntrinsicElements {
			[elem: string]: any
		}
	}
	interface Window {
		eslinkVEditorInstance: any
		eslinkV: any
	}
}

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
