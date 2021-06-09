import Editor from './Editor/index.ts'
import widgetNormal from './ui/Widget/normal'
import scene from './store/scene.store'

const eslinkV = {
	Editor,
	widgetNormal,
	scene,
}
if (window !== undefined) {
	if (!window.eslinkV) {
		window.eslinkV = {}
	}
	window.eslinkV = { ...window.eslinkV, ...eslinkV }
}
export { Editor, widgetNormal, scene }
export default eslinkV
