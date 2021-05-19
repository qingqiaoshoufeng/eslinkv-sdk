interface platformInitConfig {
	screenId?: string /*大屏ID*/
	isLocalFile?: boolean /*是否是本地文件*/
	fileUrl?: string /*本地文件地址*/
}

interface platformInitResult {
	screenConfig: any
	screenType: string /*大屏类型：CUSTOM 普通大屏 TEMPLATE 模版大屏*/
	screenAvatar: string /*大屏封面图*/
	screenName: string /*大屏名称*/
}
