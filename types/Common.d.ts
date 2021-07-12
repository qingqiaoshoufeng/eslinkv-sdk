interface MyMouseEvent extends MouseEvent {
	readonly layerX: number
	readonly layerY: number
}

export {}
declare global {
	interface Window {
		loadJS: any
		loadCSS: any
	}
}
