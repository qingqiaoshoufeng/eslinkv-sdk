<template lang="pug">
d-right-control(:label="config.label", title="支持jpg，png，gif")
	d-upload(v-model="obj[inputKey]", :data="formData", accept="image/*")
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import dUpload from '../components-right/d-upload/index.vue'
import { Tooltip, Icon } from 'view-design'

@Component({
	components: {
		'i-icon': Icon,
		dUpload,
		Tooltip,
	},
})
export default class FuncBackground extends func {
	get formData() {
		if (this.screen.chooseWidget) {
			return {
				library: `componentStatic/${this.screen.chooseWidget.type}/${this.screen.chooseWidget.config.widget.componentVersion}`,
			}
		}
		return {}
	}
}
</script>
