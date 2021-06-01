interface ScreenV {
	screenId?: string
	screenName?: string
	screenType?: string
	mainScene?: string | number
	updateScreen?(): Promise<any> /* todo 完善 */
	createScreen?(): Promise<any> /* todo 完善 */
	setSceneIndex?(index: string | number): void
	setSceneName?(name: string | number): void
	createScene?(): void
	destroyScene?(): void
	screenData?(): any /* todo 完善 */
	serialize?(res: any): void /* todo 完善 */
	chooseWidget?: any /* todo 完善 */
	sortByZIndexWidgetsList?: any /* todo 完善 */
	screenWidgets?: any /* todo 完善 */
	setWidgetItem?(
		id: string,
		type: string,
		config: any /* todo 完善 */,
		sceneIndex: string | number,
		market: boolean,
	): void
	unChooseWidget?(): void
	setStatus?(status: string): void
	setChooseWidget?(id: string): void
	setChooseWidgetCustomConfig?(customConfig: any): void /* todo 完善 */
	sceneIndex?: string | number
	autoAlignGuide?: boolean
	isMac?: boolean
	fullscreen?: boolean
	screenStyle?: any /* todo 完善 */
	sceneObj?: any /* todo 完善 */
	width?: number
	height?: number
	avatar?: string
	layoutMode?: string
	backgroundColor?: string
	backgroundImage?: string
	chooseWidgetId?: string
	chooseWidgetChildId?: string
	chooseWidgetArray?: string[]
	chooseWidgetArrayConfig?: any /* todo 完善 */
}
