import './vue.d.ts'

export interface selectSceneIndex {
	/**
	 * 切换场景
	 */
	(index: string): void
}
export interface Instance {
	/**
	 * 单例缓存实例
	 */
	(): EditorInstance
}
export interface EditorInstance {
	/**
	 * 当前场景key值
	 */
	currentSceneIndex: string
	selectSceneIndex: selectSceneIndex
}

declare module '@eslinkv/core' {
	/**
	 * 核心实例
	 */
	export class Editor {
		static Instance: Instance
	}
}
