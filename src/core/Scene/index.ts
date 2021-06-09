import Factory from '@/core/Base/factory'

export default class SceneBase extends Factory<SceneBase> {
	/* 被激活的场景对应组件 */
	activeWidgetId: string = ''
	/* 被激活的场景id */
	activeSceneId: number|string = 0
	/* 大屏场景配置 */
	screenScene: any = {}
	/* 大屏场景数据序列化 */
	sceneObj = {}
	/* 更新场景名称 */
	setSceneName(index: string | number, name: string): void {
		this.sceneObj[index].name = name.replace(/ /g, '')
	}
	/* 序列化场景数据 */
	initScene(res: any): void {
		if (res.screenScene) {
			this.screenScene = res.screenScene
		} else {
			this.screenScene = res.screenConfig.scene
		}
		delete res.screenConfig.scene
		this.sceneObj = this.screenScene
	}
	/* 创建场景 */
	createScene(name: number | string): void {
		this.sceneObj = { ...this.sceneObj, [name]: { name: `场景${name}` } }
	}
	/* 删除场景 */
	destroyScene(index: number | string): void {
		delete this.sceneObj[index]
		this.sceneObj = { ...this.sceneObj }
	}
	/* 初始化配置 */
	init(res: any): void {
		this.initScene(res)
	}
	/* 获取场景数据 */
	sceneData(): any {
		return { screenScene: this.sceneObj }
	}
}
