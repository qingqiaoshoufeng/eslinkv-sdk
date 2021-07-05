import Vue from 'vue'
import './vue.d.ts'

declare module '@eslinkv/vue2' {
	export const custom: any
	export const dEditor: any
	export const platform: any
	export const dWidgetList: any
	export const dRightManage: any
	export const dScreen: any
	export const dDetail: any
	export const dView: any
	export class widgetMixin extends Vue {
		parseConfigValue: any
		configValue: any
	}
}
