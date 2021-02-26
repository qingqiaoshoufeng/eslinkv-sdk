import 'view-design/dist/styles/iview.css'
import dEditor from './src/components/d-editor'
import widgetMixin, {configMerge} from './mixins'
import commonConfigValue from './common-config-value'
import platform from './src/store/platform.store'
import './src/api'

export {
	commonConfigValue,
	widgetMixin,
	configMerge,
	dEditor,
	platform
}
