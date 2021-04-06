<template lang="pug">
.d-right-modal-box.z-index-999.fn-flex.flex-column(
	:style="{ width: `${platform.ruler.xRoomR1}px`, height: '100%', flex: 1 }")
	.d-right-modal-name.fn-flex.flex-row
		span(contenteditable="editName", @input="changeName") {{ platform.panelConfig.info.name }}
		i-icon(
			type="md-checkmark",
			slot="suffix",
			@click="editName = false",
			v-if="editName")
		i-icon(type="ios-create-outline", @click="editName = true", v-if="!editName")
	.d-right-modal-id
		span version: {{ platform.version }}
	.d-right-modal-type
		span ID: {{ platform.panelConfig.id }}
	.d-right-modal-border
	config
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import platform from '../../store/platform.store'
import config from '../../components-func/config.vue'
import { Icon, Input } from 'view-design'
@Component({
	components: {
		config,
		'i-icon': Icon,
		'i-input': Input,
	},
})
export default class DRightManage extends Vue {
	editName: boolean = false
	platform = platform.state

	changeName(e) {
		this.platform.panelConfig.info.name = e.target.innerText
	}
}
</script>
