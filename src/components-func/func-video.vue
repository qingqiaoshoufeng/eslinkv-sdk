<template lang="pug">
.d-manage-modal-control
	label
		span(style="margin-right: 5px;") {{ config.label }}
		tooltip(content="支持mp4,webm,mov" placement="top")
			i-icon(type="ios-help-circle-outline" size="16")
	.d-manage-modal-control-right
		d-upload(v-model="obj[inputKey]", :data="formData", type="video" accept="video/*")
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import dUpload from '../components/d-upload/index.vue'
import { Tooltip, Icon } from 'view-design'

@Component({
	components: {
		'i-icon': Icon,
		dUpload,
		Tooltip,
	},
})
export default class FuncWebm extends func {
	get formData() {
		return {
			library: `componentStatic/${this.item.type}/${this.item.config.widget.componentVersion}`,
		}
	}
}
</script>
