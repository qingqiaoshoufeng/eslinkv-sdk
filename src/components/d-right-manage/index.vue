<template lang="pug">
.d-right-modal-box.z-index-999.fn-flex.flex-column(
	:style="{ width: `${platform.ruler.xRoomR1}px`, height: '100%', flex: 1 }")
	.d-right-modal-name.fn-flex.flex-row
		span#platform-name(:contenteditable="editName") {{ staticName }}
		i-icon.pointer(
			type="md-checkmark",
			slot="suffix",
			@click="changeName",
			v-if="editName")
		i-icon.pointer(
			type="ios-create-outline",
			@click="editName = true",
			v-if="!editName")
	.d-right-modal-id
		span version: {{ platform.version }}
	.d-right-modal-type
		span ID: {{ platform.panelConfig.id }}
	.d-right-modal-border
	config
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import platform from '../../store/platform.store'
import configProd from '../../components-func-prod/config.vue'
import configDev from '../../components-func-dev/config.vue'
import { Icon, Input } from 'view-design'
import dev from './dev'
import prod from './prod'
@Component({
	components: {
		config:
			process.env.VUE_APP_ESLINKV_MODE === 'DEV' ? configDev : configProd,
		'i-icon': Icon,
		'i-input': Input,
	},
})
export default class DRightManage extends mixins(
	// @ts-ignore
	process.env.VUE_APP_ESLINKV_MODE === 'DEV' ? dev : prod,
) {
	editName = false
	platform = platform.state

	get staticName() {
		return this.platform.screenName
	}
}
</script>
