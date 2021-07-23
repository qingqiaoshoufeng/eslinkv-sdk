import './vue.d.ts'

interface selectSceneIndex {
	/**
	 * 切换场景
	 */
	(index: string | number): void
}
interface Instance {
	/**
	 * 单例缓存实例
	 */
	(): EditorInstance
}
interface setLocalComponents {
	/**
	 * 注册内置组件
	 */
	(components: any): void
}
interface setLocalWidgets {
	/**
	 * 设置内置组件
	 */
	(obj: any): void
}
interface loadJs {
	/**
	 * 加载外部js
	 */
	(src: string | string[], value: string): Promise<any>
}
interface loadCss {
	/**
	 * 加载外部css
	 */
	(src: string | string[], value: string): Promise<any>
}

interface localInit {
	/**
	 * 初始化本地组件集
	 */
	(obj: any): void
}

interface createWidget {
	/**
	 * 创建组件
	 */
	(x: number, y: number, data: any): void
}

interface init {
	/**
	 * 编辑器初始化
	 */
	(res: any): void
}
interface screen {
	screenWidgets: any
}
export interface EditorInstance {
	/**
	 * 当前场景key值
	 */
	currentSceneIndex: string
	selectSceneIndex: selectSceneIndex
	setLocalComponents: setLocalComponents
	setLocalWidgets: setLocalWidgets
	localInit: localInit
	createWidget: createWidget
	init: init
	/**
	 * 当前大屏背景色
	 */
	backgroundColor: string
	screen: screen
}

declare module '@eslinkv/core' {
	/**
	 * 核心实例
	 */
	export class Editor {
		static Instance: Instance
	}

	export const loadCss: loadCss
	export const loadJs: loadJs
}
