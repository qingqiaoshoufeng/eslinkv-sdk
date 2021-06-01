interface RulerV {
	dragId?: string
	xRoomL1?: number
	xRoomL2?: number
	xRoomR1?: number
	yRoom?: number
	/* 参考线 */
	guideLines?: any /* todo 完善 */
	/* 参考线开始移动的位置 */
	guideStartX?: number
	/* 参考线开始移动的位置 */
	guideStartY?: number
	/* 参考线可见 */
	guideVisible?: boolean
	/* 当前位置x */
	contentX?: number
	/* 当前位置y */
	contentY?: number
	/* 滚动距离 */
	contentScrollLeft?: number
	/* 滚动距离 */
	contentScrollTop?: number
	/* 被移动线的ID */
	dragGuideId?: string
	/* 标尺步长 */
	stepLength?: number
	/* 标尺高度，容差 */
	size?: number
	/* 当前标尺zoom */
	zoom?: number
	/* 当前标尺zoom步长 */
	zoomStep?: number
	/* 当前画布大小宽 */
	width?: number
	/* 当前画布大小高 */
	height?: number
	guideSite?(type: string): any /* todo 完善 */
	resetZoom?(): void
	zoomOut?(zoom: number | string): void
	zoomIn?(zoom: number | string): void
}
