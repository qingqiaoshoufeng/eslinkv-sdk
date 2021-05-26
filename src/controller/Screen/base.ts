export default class ScreenBase {
	/* 大屏ID */
	public screenId: string = ''
	/* 大屏名 */
	public screenName: string = ''
	/* 大屏配置 */
	public screenConfig: any = {}
	/* 大屏类型 CUSTOM:大屏 TEMPLATE:模版 */
	public screenType: string = ''
	/* 大屏发布情况 EDIT:未发布 COMPLETE:已发布 */
	public screenPublish: string = ''
	/* 大屏缩略图 */
	public screenAvatar: string = ''
	/* 大屏版本号 */
	public screenVersion: string = ''
	/* 大屏适配方式 */
	public screenLayoutMode: string = ''
	/* 备注 */
	public remark: string = ''
	/* 排序 */
	public sort: number = 1
	/* 创建时间 */
	public createTime: string
	/* 更新时间 */
	public updateTime: string
}
