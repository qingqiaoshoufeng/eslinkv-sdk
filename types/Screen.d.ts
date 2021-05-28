interface platformInitConfig {
	screenId?: string /*大屏ID*/
	isLocalFile?: boolean /*是否是本地文件*/
	fileUrl?: string /*本地文件地址*/
	initBefore?: () => void /*初始化前运行的回调函数*/
	initComplete?: () => void /*初始化完成后运行的回调函数*/
	initError?: () => void /*初始化失败时运行的回调函数*/
}

interface platformInitResult {
	screenConfig: screenConfig
	screenType: string /*大屏类型：CUSTOM 普通大屏 TEMPLATE 模版大屏*/
	screenAvatar: string /*大屏封面图*/
	screenName: string /*大屏名称*/
	screenVersion: number /*大屏版本号*/
}

interface screenConfig {
	kanboard?: any /* todo 大屏配置 老板*/
	panelConfig?: any /* todo 大屏配置 新版*/
	scene: sceneConfig
	widgets: widgetConfigOriginal[]
}

interface screenBaseInstance {
	screenId: string
	screenName: string
	updateScreen(): void
}
