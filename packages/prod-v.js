import dEditor from '../src/components/d-editor/index.vue'
import dScreen from '../src/components/d-screen/index.vue'
import dFooter from '../src/components/d-footer/index.vue'
import dView from '../src/components/d-view/index.vue'
import dDetail from '../src/components/d-detail/index.vue'
import loadMask from '../src/components/load-mask/index.vue'

const eslinkV = {
	dDetail,
	dEditor,
	dScreen,
	dFooter,
	dView,
	loadMask,
}
if (window !== undefined) {
	if (!window.eslinkV) {
		window.eslinkV = {}
	}
	window.eslinkV = { ...window.eslinkV, ...eslinkV }
}

export { dEditor, dScreen, dFooter, dView, loadMask }
export default eslinkV
