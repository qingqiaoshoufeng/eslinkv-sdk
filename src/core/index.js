import Editor from './Editor/index.ts'
import widgetNormal from './ui/Widget/normal'

const eslinkV = {
	Editor,
	widgetNormal,
}
if (window !== undefined) {
	if (!window.eslinkV) {
		window.eslinkV = {}
	}
	window.eslinkV = { ...window.eslinkV, ...eslinkV }
}
export { Editor, widgetNormal }
export default eslinkV
