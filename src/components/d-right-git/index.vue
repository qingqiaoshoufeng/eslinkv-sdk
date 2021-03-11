<template lang="pug">
	d-right-modal.d-git-modal(title="看板历史" :width="360" icon="md-git-branch" :top="187")
		header.fn-flex.flex-row
			span 看板历史
</template>
<script lang="ts">
	import dRightModal from '../d-right-modal/index.vue'
	import {Component, Vue} from 'vue-property-decorator'
	import {Icon, Input, Select, Option, DropdownMenu, DropdownItem, Dropdown, Modal, Button} from 'view-design'
	import scene from '../../store/scene.store'
	import platform from '../../store/platform.store'
	import {copyText} from '../../utils/index'

	@Component({
		components: {
			dRightModal,
		},
	})
	export default class DRightGit extends Vue {

	}
</script>
<style lang="scss" scoped>
	@import "../../../src/scss/conf";

	.d-git-modal {
		header {
			width: 100%;
			height: 42px;
			line-height: 42px;
			font-weight: bold;
			font-size: 14px;
			flex: 0 0 auto;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid $borderColor;
		}
	}
</style>
