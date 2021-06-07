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
	selectWidget(widget: Widget): void {
		if (widget.config.widget.hide) {
			return
		}
		this.currentWidgetId = widget.id
		this.currentWidget = { ...widget }
	}
	/* 取消选中组件集合 */
	unSelectWidgetList(): void {
		this.currentWidgetList = []
	}
	/* 添加到选中组件集合 */
	selectWidgetList(list: Widget): void {
		this.currentWidgetList = [...this.currentWidgetList, list]
	}
	/* 取消选中组件 */
	unSelectWidget(): void {
		this.currentWidgetId = ''
		this.currentWidget = null
		this.currentWidgetList = []
		document.getElementById('right-menu').classList.remove('active')
	}
	/* 选中场景 */
	selectSceneIndex(val: number | string): void {
		if (typeof val === 'number' || val) this.currentSceneIndex = val
		let event = new CustomEvent('SceneIndex', { detail: { index: val } })
		document.dispatchEvent(event)
		event = null
	}
}
