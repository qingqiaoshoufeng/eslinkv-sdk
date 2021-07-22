import Factory from '@/core/Base/factory'

const rulerContainerId = `drag-content-${+new Date()}`
export default class EditorBase extends Factory<EditorBase> {
	rulerContainerId = rulerContainerId
	/* 大屏ID */
	screenId: string
	/* 大屏平台状态 是否自动贴靠参考线*/
	autoAlignGuide = true
	/* 大屏状态 inEdit  在编辑器中  inPreview 在预览中*/
	editorStatus = 'inPreview'
	/* 大屏平台状态 是否全屏*/
	fullscreen = false
	/* 组件加载状态 */
	widgetLoaded = {}
	/* 更新组件加载状态 */
	updateWidgetLoaded(key: string): void {
		this.widgetLoaded[key] = true
	}
	/* 更新大屏状态 */
	updateEditorStatus(status: string): void {
		this.editorStatus = status
	}
}
