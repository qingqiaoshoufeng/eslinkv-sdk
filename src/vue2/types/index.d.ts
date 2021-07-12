import Vue from 'vue'
import './vue.d.ts'

interface __handleClick__ {
	/**
	 * widgetNormalMixin(即将废弃 请使用 __handleEvent__)
	 *
	 * 组件事件、场景事件配置
	 *
	 * 目前支持更新组件、场景切换、添加场景、移除场景
	 */
	(val: any): void
}

interface __handleEvent__ {
	/**
	 * widgetNormalMixin
	 *
	 * 组件事件、场景事件配置
	 *
	 * 目前支持更新组件、场景切换、添加场景、移除场景
	 */
	(val: any, eventType: string): void
}

declare module '@eslinkv/vue2' {
	/**
	 * Vue2.x 组件
	 *
	 * 核心组件-编辑器组件
	 */
	export const dScreen: any
	/**
	 * Vue2.x 组件
	 *
	 * 核心组件-详细组件
	 */
	export class dDetail extends Vue {}
	/**
	 * Vue2.x 组件
	 *
	 * 核心组件-渲染组件
	 */
	export class dView extends Vue {}
	/**
	 * Vue2.x 组件(即将废弃 请使用 widgetNormalMixin)
	 *
	 * 自定义组件-基础mixin
	 */
	export class widgetMixin extends Vue {}
	/**
	 * Vue2.x 组件
	 *
	 * 自定义组件-基础组件
	 *
	 * props.value 组件默认值
	 *
	 * props.customConfig 组件配置值
	 *
	 * props.settingData 自定义数据过滤默认值
	 *
	 * props.setting 自定义数据过滤配置值
	 */
	export class widgetNormal extends Vue {}
	/**
	 * Vue2.x 组件
	 *
	 * 自定义组件-基础mixin
	 */
	export class widgetNormalMixin extends Vue {
		/**
		 * widgetNormalMixin
		 *
		 * 组件id
		 *
		 * <div id="d-1625708339316"></div>
		 */
		id: string
		/**
		 * widgetNormalMixin
		 *
		 * 实例缓存对象
		 *
		 * 例如：用于echarts的实例对象
		 */
		instance: any
		/**
		 * widgetNormalMixin
		 *
		 * 组件数据对象
		 *
		 * eslinkV缓存数据或通过API请求获取到的数据
		 */
		data: any
		/**
		 * widgetNormalMixin
		 *
		 * 自定义数据过滤默认值
		 *
		 * 例如：[{x:'value'}]
		 */
		settingData: { [key: string]: string }[]
		/**
		 * widgetNormalMixin
		 *
		 * 组件配置对象
		 *
		 * 例如：组件的长、宽、定位……
		 */
		config: any
		__handleClick__: __handleClick__
		__handleEvent__: __handleEvent__
		/**
		 * widgetNormalMixin
		 *
		 * 动画定时器
		 */
		animateTimer: any
		/**
		 * widgetNormalMixin
		 *
		 * 动画定时器,当前播放索引值
		 */
		animateActiveIndex: number
		/**
		 * widgetNormalMixin
		 *
		 * 是否在预览/编辑器中
		 */
		inPreview: boolean
	}
}
