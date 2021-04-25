import widgetMixin from '../mixins'
import '../src/plugins'
import './plugin.js'

const eslinkV = {
	widgetMixin,
}
if (window !== undefined) {
	if (!window.eslinkV) {
		window.eslinkV = {}
	}
	window.eslinkV = { ...window.eslinkV, ...eslinkV }
}

export { widgetMixin }
export default eslinkV