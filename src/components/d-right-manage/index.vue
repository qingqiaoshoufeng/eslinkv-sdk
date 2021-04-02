<template lang="pug">
.d-right-modal-box.z-index-999(:style="{ width: `${platform.ruler.xRoomR1}px` }")
	.d-right-modal-title.pointer.text-center.fn-flex.flex-row
		span 页面设置
	.d-right-modal.d-scrollbar
		config
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import platform from '../../store/platform.store'
import config from '../../components-func/config.vue'

@Component({
	components: {
		config,
	},
})
export default class DRightManage extends Vue {
	choose = 0
	platform = platform.state

	list: any = [
		{
			key: [{ type: 'config' }],
			needChoose: false,
		},
	]
}
</script>
