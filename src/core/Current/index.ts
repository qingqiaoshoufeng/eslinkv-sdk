import Factory from '@/core/Base/factory'
import Widget from '@/core/Widget/normal'

export default class Current extends Factory<Current> {
	/* 当前组件 */
	currentWidgetId = ''
	currentWidget: Widget | null
	/* 当前选中组件-多组件 */
	currentWidgetList: Widget[] = []
	/* 当前场景 */
	currentSceneIndex: number | string = 0
	/* 当前打开的场景集合 */
	currentCreateSceneList = []
	/* 当前选中组件-多组件配置 */
	currentWidgetListConfig = {
		left: 0,
		top: 0,
		width: 0,
		height: 0,
		z: 0,
	}
	/* 选中组件 */
	selectWidget(widget: Widget): void {
		if (widget.config.widget.hide) {
			return
		}
		this.currentWidgetId = widget.id
		this.currentWidget = null
		this.currentWidget = widget
		this.currentWidgetList = []
	}
	/* 取消选中组件 */
	unSelectWidget(): void {
		this.currentWidgetId = ''
		this.currentWidget = null
		this.currentWidgetList = []
	}
	/* 取消选中组件集合 */
	unSelectWidgetList(): void {
		this.currentWidgetList = []
	}
	selectWidgetList(config: any): void {
		this.currentWidgetListConfig = config
	}
	/* 添加到选中组件集合 */
	addWidgetList(list: Widget): void {
		this.currentWidgetList = [...this.currentWidgetList, list]
	}
	/* 选中场景 */
	selectSceneIndex(val: number | string): void {
		if (typeof val === 'number' || val) this.currentSceneIndex = val
		let event = new CustomEvent('SceneIndex', { detail: { index: val } })
		document.dispatchEvent(event)
		event = null
	}
	/* 打开场景 */
	openScene(id: string): void {
		this.currentCreateSceneList = [...this.currentCreateSceneList, id]
	}
	/* 关闭场景 */
	closeScene(id: string): void {
		const index = this.currentCreateSceneList.findIndex(v => v === id)
		this.currentCreateSceneList.splice(index, 1)
		this.currentCreateSceneList = [...this.currentCreateSceneList]
	}
}
