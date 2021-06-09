import Editor from './Editor/index.ts'
import widgetNormal from './ui/Widget/normal'
import scene from './store/scene.store'
import instance from './store/instance.store'

const eslinkV = {
	Editor,
	widgetNormal,
	scene,
	instance,
}
if (window !== undefined) {
	if (!window.eslinkV) {
		window.eslinkV = {}
	}
	window.eslinkV = { ...window.eslinkV, ...eslinkV }
}
export { Editor, widgetNormal, scene, instance }
export default eslinkV
