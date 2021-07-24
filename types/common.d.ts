export {}
declare global {
	interface Window {
		loadJS: any
		loadCSS: any
	}
	export class MyMouseEvent extends MouseEvent {
		readonly layerX: number
		readonly layerY: number
	}
}
