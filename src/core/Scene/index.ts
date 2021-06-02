import { uuid } from '@/core/utils'
import Vue from 'vue'
import Factory from '@/core/Base/factory'

export default class SceneBase extends Factory<SceneBase> {
	/* 大屏场景配置 */
	public screenScene: any = {}
	/* 大屏场景数据序列化 */
	public sceneList = []
	/* 大屏场景数据序列化 */
	public sceneObj = {}
	/* 大屏当前场景 */
	public sceneIndex: number | string = 0
	/* 大屏场景组件关联 */
	public sceneWidgets = {}
	/* 切换场景 */
	public setSceneIndex(val: number | string): void {
		this.sceneIndex = val
		let event = new CustomEvent('SceneIndex', { detail: { index: val } })
		document.dispatchEvent(event)
		event = null
	}
	/* 更新场景名称 */
	public setSceneName(name: string): void {
		this.sceneObj[this.sceneIndex].name = name.replace(/ /g, '')
	}
	/* 序列化场景数据 */
	public initScene(res: any): void {
		if (res.screenScene) {
			this.screenScene = res.screenScene
		} else {
			this.screenScene = res.screenConfig.scene
		}
		delete Vue.prototype.$screen.screenConfig.scene
		if (this.screenScene instanceof Array) {
			this.sceneList = this.screenScene
			this.screenScene.forEach(item => {
				this.sceneObj[item] = {
					name: `场景${item}`,
				}
			})
		} else {
			if (this.screenScene) {
				this.sceneObj = this.screenScene
				const arr = []
				for (const key in this.screenScene) {
					arr.push({ name: this.screenScene[key].name, key })
				}
				arr.sort(function (a, b) {
					return a.name.localeCompare(b.name)
				})
				this.sceneList = arr.map(item => item.key)
			}
		}
	}
	/* 创建场景 */
	public createScene(): void {
		const name = uuid()
		Vue.set(this.sceneList, this.sceneList.length, name)
		Vue.set(this.sceneObj, name, { name: `场景${name}` })
		this.setSceneIndex(name)
	}
	/* 删除场景 */
	public destroyScene(): void {
		if (this.sceneIndex !== 0) {
			Vue.prototype.$Modal.confirm({
				title: '是否删除当前场景？',
				content: '该场景未删除的组件将自动进入回收站！',
				onOk: () => {
					const index = this.sceneIndex
					this.setSceneIndex(0)
					Vue.delete(this.sceneObj, index)
					for (const key in Vue.prototype.$screen.screenWidgets) {
						const item = Vue.prototype.$screen.screenWidgets[key]
						if (item.scene === index) {
							item.scene = -1
						}
					}
				},
			})
		}
	}
	/* 初始化配置 */
	public init(res: any): void {}
	/* 获取场景数据 */
	public sceneData(): any {
		return { screenScene: this.sceneObj }
	}
}
