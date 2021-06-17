import Editor from './Editor/index.ts'

const editor = Editor.Instance()
const eslinkV = {
	Editor,
}
if (window !== undefined) {
	if (!window.eslinkV) {
		window.eslinkV = {}
	}
	window.eslinkV = { ...window.eslinkV, ...eslinkV }
}
window.eslinkV.scene = {
	actions: {
		setSceneIndex(index) {
			editor.selectSceneIndex(index)
		},
		destroyScene(index) {
			editor.closeScene(index)
		},
		createSceneInstance(id) {
			editor.openScene(id)
		},
	},
}
window.eslinkV.instance = {
	actions: {
		updateComponentTarget(id, target, value) {
			editor.updateComponentTarget(id, target, value)
		},
		updateComponent(id, config) {
			editor.updateComponent(id, config)
		},
	},
}
export { Editor }
export default eslinkV
