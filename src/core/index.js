import Editor from './Editor/index.ts'
import scene from './store/scene.store'
import instance from './store/instance.store'

const eslinkV = {
	Editor,
	scene,
	instance,
}
if (window !== undefined) {
	if (!window.eslinkV) {
		window.eslinkV = {}
	}
	window.eslinkV = { ...window.eslinkV, ...eslinkV }
}
export { Editor, scene, instance }
export default eslinkV
