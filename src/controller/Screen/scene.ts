import { uuid } from '@/utils'
import { Modal } from 'view-design'
import Vue from 'vue'
export default class SceneBase {
	/* 大屏场景配置 */
	public screenScene: any = {}
	/* 大屏场景数据序列化 */
	public sceneList = []
	/* 大屏场景数据序列化 */
	public sceneObj = {}
	/* 大屏当前场景 */
	public sceneIndex = 0
	/* 切换场景 */
	public setSceneIndex(val) {
		this.sceneIndex = val
		let event = new CustomEvent('SceneIndex', { detail: { index: val } })
		document.dispatchEvent(event)
		event = null
	}
	/* 更新场景名称 */
	public setSceneName(name) {
		this.sceneObj[this.sceneIndex].name = name.replace(/ /g, '')
	}
	/* 序列化场景数据 */
	public initScene(res) {
		if (res.screenScene) {
			this.screenScene = res.screenScene
		} else {
			this.screenScene = res.screenConfig.scene
		}
		if (this.screenScene instanceof Array) {
			this.sceneList = this.screenScene
			this.screenScene.forEach(item => {
				this.sceneObj[item] = {
					name: `场景${item}`,
				}
			})
		} else {
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
		// todo
		// const widgets = Object.values(Vue.prototype.$screen.screenWidgets)
		// const list = this.list
		// widgets.forEach(item => {
		// 	const index = list.indexOf(item.scene)
		// 	if (index !== -1) {
		// 		if (!this.sceneObj[list[index]]) {
		// 			this.sceneObj[list[index]] = {}
		// 		}
		// 		if (!this.sceneObj[list[index]].list) {
		// 			this.sceneObj[list[index]].list = []
		// 		}
		// 		this.sceneObj[list[index]].list.push(item)
		// 	}
		// })
	}
	/* 创建场景 */
	public createScene() {
		const name = uuid()
		Vue.set(this.sceneList, this.sceneList.length, name)
		Vue.set(this.sceneObj, name, { name: `场景${name}` })
		this.setSceneIndex(name)
	}
	/* 删除场景 */
	public destroyScene() {
		if (this.sceneIndex === 0) {
			return false
		}
		Modal.confirm({
			title: '提示',
			content: '是否删除当前场景？该场景未删除的组件将自动进入回收站！',
			onOk: () => {
				const index = this.sceneIndex
				this.setSceneIndex(0)
				Vue.delete(this.sceneObj, index)
				this.sceneList.splice(index, 1)
				// todo
				// for (const key in this.screen.screenWidgets) {
				// 	const item = this.screen.screenWidgets[key]
				// 	if (item.scene === index) {
				// 		item.scene = -1
				// 	}
				// }
			},
		})
	}
}
