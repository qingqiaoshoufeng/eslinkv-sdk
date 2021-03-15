<template lang="pug">
	d-right-modal.d-fullscreen-modal(
		:title="platform.fullscreen ? '进入全屏' : '退出全屏'"
		:icon="platform.fullscreen?'md-contract':'md-expand'"
		:top="33"
		:needModel="false"
		@click="handleFullscreen")
</template>
<script lang="ts">
	import dRightModal from '../d-right-modal/index.vue'
	import { Component, Vue } from 'vue-property-decorator'
	import platform from '../../store/platform.store'

	@Component({
		components: {
			dRightModal
		}
	})
	export default class DRightFullScene extends Vue {
		platform: any = platform.state

		handleFullscreen () {
			if (this.platform.fullscreen) {
				document.exitFullscreen()
			} else {
				document.body.requestFullscreen()
			}
		}
	}
</script>
