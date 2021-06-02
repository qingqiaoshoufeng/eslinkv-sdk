import { Vue, Component } from 'vue-property-decorator'

@Component
class Mixins extends Vue {
	screen = this.$screen
	updateWidget(value) {
		if (!value || !value.widget) return
		const id = value.widget.id
		const currentWidget = this.screen.screenWidgets[id]
		if (!id || !currentWidget) return
		this.$set(currentWidget, 'config', value)
	}

	handleActivated(obj) {
		const { config, id } = obj
		if (config.widget.hide) {
			return
		}
		this.screen.setChooseWidget(id)
		this.screen.setChooseWidgetCustomConfig(config.customConfig)
	}
}

export default Mixins
