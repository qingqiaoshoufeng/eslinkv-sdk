import {
	Input,
	InputNumber,
	Select,
	Option,
	Switch,
	ColorPicker,
	Collapse,
	// @ts-ignore
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
import event from '../store/event.store'
import scene from '../store/scene.store'
import dRightSwiper from '../components-right/d-right-swiper/index.vue'
import dRightSwiperList from '../components-right/d-right-swiper-list/index.vue'
import dRightSwiperEye from '../components-right/d-right-swiper-eye/index.vue'
import dRightControl from '../components-right/d-right-control/index.vue'
import dInput from '../components/d-input/index.vue'

@Component({
	components: {
		dRightSwiper,
		dRightControl,
		dInput,
		dRightSwiperList,
		dRightSwiperEye,
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
	},
})
export default class Func extends Vue {
	platform = platform.state
	scene = scene.state
	event = event.state
	@Prop() config
	@Prop() parentProp // group时会有
	@Prop() parentIndex // group时会有

	get item() {
		if (this.platform.widgetAdded[this.platform.chooseWidgetId]) {
			return this.platform.widgetAdded[this.platform.chooseWidgetId]
		} else {
			return null
		}
	}

	get fixedConfig() {
		if (this.parentProp) {
			return {
				...this.config,
				prop: `config.config.${this.parentProp}.${this.config.prop}`,
			}
		} else {
			return this.config
		}
	}

	get obj() {
		if (!this.fixedConfig.prop) return null
		let res = this.item
		const props = this.fixedConfig.prop.split('.')
		props.length = props.length - 1
		props.forEach(v => {
			res = res[v]
		})
		return this.parentProp ? res[this.parentIndex] : res
	}

	// config.api.data，返回‘data‘
	get inputKey() {
		if (this.parentProp) return this.config.prop
		if (!this.fixedConfig.prop) return null
		const props = this.fixedConfig.prop.split('.')
		return props.reverse()[0]
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
