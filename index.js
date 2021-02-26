import dEditor from './src/components/d-editor'
import widgetMixin, {configMerge} from './mixins'
import commonConfigValue from './common-config-value'
import platform from './src/store/platform.store'
import './src/api'
import 'view-design/dist/styles/iview.css'
import './src/scss/reset.scss'
import './src/scss/index.scss'

export {
	commonConfigValue,
	widgetMixin,
	configMerge,
	dEditor,
	platform
}
