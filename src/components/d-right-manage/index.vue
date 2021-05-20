<template lang="pug">
.d-right-modal-box.z-index-999.fn-flex.flex-column(
	:style="{ width: `${ruler.xRoomR1}px`, height: '100%', flex: 1 }")
	.d-right-modal-name.fn-flex.flex-row(:style="{ marginBottom: '10px' }")
		span#platform-name(:contenteditable="editName") {{ staticName }}
		i-icon.pointer(
			type="md-checkmark",
			slot="suffix",
			@click="changeName",
			v-if="editName")
		i-icon.pointer(
			type="ios-create-outline",
			@click="editNameHandle",
			v-if="!editName")
	.d-right-modal-border
	config
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import platform from '../../store/platform.store'
import ruler from '../../store/ruler.store'
import config from './config.vue'
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
	ruler = ruler.state

	get staticName() {
		return this.platform.screenName
	}

	editNameHandle() {
		this.editName = true
		setTimeout(() => {
			document.getElementById('platform-name').focus()
		}, 0)
	}

	changeName() {
		const id = this.$route.params.id
		const screenName = document.getElementById('platform-name').innerText
		this.editName = false
		this.platform.screenName = screenName
		// START_PROD
		this.$api.screen
			.update({
				screenId: id,
				screenName,
			})
			.then(() => {
				this.$Message.success('修改成功')
			})
		// END_PROD
	}
}
</script>
