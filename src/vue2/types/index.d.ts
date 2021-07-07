import Vue from 'vue'
import './vue.d.ts'

declare module '@eslinkv/vue2' {
	/**
	 * Vue 组件
	 *
	 * 核心组件-编辑器组件
	 */
	export const dScreen: any
	/**
	 * Vue 组件
	 *
	 * 核心组件-详细组件
	 */
	export class dDetail extends Vue {}
	/**
	 * Vue 组件
	 *
	 * 核心组件-渲染组件
	 */
	export class dView extends Vue {}
	/**
	 * Vue 组件
	 *
	 * 自定义组件-基础mixin
	 */
	export class widgetMixin extends Vue {
		parseConfigValue: any
		configValue: any
	}
	/**
	 * Vue 组件
	 *
	 * 自定义组件-基础组件
	 */
	export class widgetNormal extends Vue {}
}
