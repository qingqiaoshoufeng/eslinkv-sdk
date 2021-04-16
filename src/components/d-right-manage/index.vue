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
	editName = false
	platform = platform.state

	get staticName() {
		return this.platform.screenName
	}

	changeName() {
		const id = this.$route.params.id
		const screenName = document.getElementById('platform-name').innerText
		this.editName = false
		this.platform.screenName = screenName
		this.$api.screen
			.update({
				screenId: id,
				screenName,
			})
			.then(() => {
				this.$Message.success('修改成功')
			})
	}
}
</script>
