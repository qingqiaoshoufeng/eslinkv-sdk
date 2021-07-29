import Factory from '@/core/Base/factory'
import ScreenPc from '@/core/Screen/pc'
import Current from '@/core/Current'
import Scene from '@/core/Scene'
import Http from '@/core/Http'
import Local from '@/core/Local'
import Ruler from '@/core/ui/Ruler'

const rulerContainerId = `drag-content-${+new Date()}`
export default class EditorBase extends Factory<EditorBase> {
	screen: ScreenPc = ScreenPc.Instance()
	current: Current = Current.Instance({
		rulerContainerId,
	})
	scene: Scene = Scene.Instance()
	http: Http = Http.Instance()
	local: Local = Local.Instance()
	ruler: Ruler | null
	rulerContainerId = rulerContainerId
	/* 大屏ID */
	screenId: string
	/* 大屏平台状态 是否自动贴靠参考线 */
	autoAlignGuide = true
	/* 大屏状态 inEdit  在编辑器中  inPreview 在预览中 */
	editorStatus = 'inPreview'
	/* 大屏平台状态 是否全屏 */
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
	constructor() {
		super()
	}
}
