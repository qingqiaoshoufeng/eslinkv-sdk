interface sceneConfig {
	[key: string]: sceneConfigItem
}

interface sceneConfigItem {
	name: string
}

interface sceneInstance {
	screenScene: any
	sceneList: any
	sceneObj: any
	sceneIndex: number | string
	createScene(): void
	destroyScene(): void
	initScene(res: any): void
}
