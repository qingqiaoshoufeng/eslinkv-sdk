import Vue, { VNode } from 'vue'

declare module '*.vue' {
	import Vue from 'vue'
	export default Vue
}

declare global {
	namespace JSX {
		// tslint:disable no-empty-interface
		// @ts-ignore
		interface Element extends VNode {}
		interface IntrinsicElements {
			[elem: string]: any
		}
	}
	interface Window {
		eslinkVEditorInstance: any
		eslinkV: any
	}
}
