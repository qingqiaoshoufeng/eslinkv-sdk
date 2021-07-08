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
export interface EditorInstance {
	/**
	 * 当前场景key值
	 */
	currentSceneIndex: string
	selectSceneIndex: selectSceneIndex
	setLocalComponents: setLocalComponents
	setLocalWidgets: setLocalWidgets
}

declare module '@eslinkv/core' {
	/**
	 * 核心实例
	 */
	export class Editor {
		static Instance: Instance
	}
}
