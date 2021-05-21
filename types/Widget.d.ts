interface widgetConfigOriginal {
	id: string /*组件id*/
	market: boolean /*组件是否来自组件市场*/
	scene: string | number /*组件所属场景*/
	type: string /*组件类别*/
	value: any /* todo 组件详细配置*/
}

interface widgetConfig {
	id: string /*组件id*/
	market: boolean /*组件是否来自组件市场*/
	scene: string | number /*组件所属场景*/
	type: string /*组件类别*/
	config: any /* todo 组件详细配置*/
}

interface widgetUseResult {
	componentJsUrl: string /*组件js url*/
	componentAvatar: string /*组件缩略图*/
	componentEnTitle: string /*组件英文名即类型*/
	componentId: string /*组件id*/
	componentTitle: string /*组件中文名*/
	componentType: string /*组件类别：基础 BASICS 地图 MAP 图表antv ANTV 图表Echarts ECHARTS*/
	componentTypeId: string /*组件所属分类id*/
	componentVersion: string /*组件版本号*/
	componentZipUrl: string /*组件zip url*/
	createTime: string /*组件创建时间*/
	updateTime: string /*组件更新时间*/
	isCurrentVersion: boolean /*组件会有多个版本，是否为当前版本*/
	sort: number /*组件排序*/
	status: string /*组件状态：审核中 PENDING 审核成功 SUCCESS 审核失败 ERROR*/
}
