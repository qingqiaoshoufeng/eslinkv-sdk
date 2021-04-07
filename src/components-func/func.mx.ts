import {
	Input,
	InputNumber,
	Select,
	Option,
	Switch,
	ColorPicker,
	Collapse,
	Panel,
	Button,
	CheckboxGroup,
	Checkbox,
	Icon,
	Upload,
	Modal,
} from 'view-design'
import { Component, Vue, Prop } from 'vue-property-decorator'
import platform from '../store/platform.store'
import scene from '../store/scene.store'

const editor = require('vue2-ace-editor')

@Component({
	components: {
		'i-input': Input,
		'i-upload': Upload,
		'i-icon': Icon,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-switch': Switch,
		'i-color-picker': ColorPicker,
		'i-collapse': Collapse,
		'i-panel': Panel,
		'i-button': Button,
		'i-modal': Modal,
		CheckboxGroup,
		Checkbox,
		editor,
	},
})
export default class Func extends Vue {
	platform = platform.state
	scene = scene.state
	@Prop() config
	@Prop() parent // group时会有

	get item() {
		if (this.platform.widgetAdded[this.platform.chooseWidgetId]) {
			return this.platform.widgetAdded[this.platform.chooseWidgetId]
		} else {
			return null
		}
	}

	get obj() {
		if (!this.config.prop) return null
		let res = this.item
		const props = this.config.prop.split('.')
		props.length = props.length - 1
		props.forEach(v => {
			res = res[v]
		})
		return res
	}

	// config.api.data，返回‘data‘
	get inputKey() {
		if (!this.config.prop) return null
		const props = this.config.prop.split('.')
		return props.reverse()[0]
	}

	editorInit() {
		require('brace/ext/language_tools')
		require('brace/mode/html')
		require('brace/mode/javascript')
		require('brace/mode/less')
		require('brace/mode/json')
		require('brace/theme/idle_fingers')
		require('brace/snippets/javascript')
	}

	getItemValue(keyString) {
		let res = this.item
		const props = keyString.split('.')
		props.forEach(v => {
			res = res[v]
		})
		return res
	}

	getItemObj(keyString) {
		let res = this.item
		const props = keyString.split('.')
		props.length = props.length - 1
		props.forEach(v => {
			res = res[v]
		})
		return res
	}
}
