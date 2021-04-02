<template lang="pug">
.d-manage-modal-control
	label {{ config.label }}
	d-upload(v-model="obj[inputKey]", :data="formData", type="video")
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import dUpload from '../components/d-upload'

@Component({
	components: {
		dUpload,
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
