<template lang="pug">
	.d-right-modal-box.pos-a(:style="{top:`${top}px`}")
		.d-right.pos-a.pointer(@click="handleClick")
			i-icon(:type="icon" :title="title" size="24" :class="[{active:rightModal}]")
		.d-right-modal.pos-a(:class="[{active:rightModal}]" :style="{width:`${width}px`,top:`-${top-35}px`}" v-if="needModel")
			slot
</template>
<script lang="ts">
	import { Icon } from 'view-design'
	import { Component, Vue, Prop } from 'vue-property-decorator'
	import { findComponentsDownward } from '../../utils/index'

	@Component({
		components: {
			'i-icon': Icon
		}
	})
	export default class DRightModal extends Vue {
		rightModal = false
		@Prop({ default: 470 }) width: number
		@Prop({ default: 'ios-construct' }) icon: string
		@Prop({ default: '标题' }) title: string
		@Prop({ default: 33 }) top: number
		@Prop({ default: true }) needModel: boolean


		handleClick () {
			if (this.needModel) {
				if (this.rightModal) {
					this.rightModal = false
				} else {
					const list = findComponentsDownward(this.$parent.$parent, 'DRightModal')
					list.forEach(item => {
						item.rightModal = false
					})
					this.rightModal = true
				}
			}
			this.$emit('click')
		}
	}
</script>
<style lang="scss" scoped>
	@import "../../../src/scss/conf";

	.d-right-modal-box {
		right: 15px;
		width: 24px;
		height: 24px;
	}

	.d-right {
		top: 0;
		right: 0;
		z-index: 2;
		width: 24px;
		height: 24px;

		.ivu-icon {
			color: $themeColor;
			opacity: 0.6;

			&:hover,
			&.active {
				opacity: 1;
			}
		}
	}

	.d-right-modal {
		right: -380px;
		z-index: 3;
		height: calc(100vh - 140px);
		padding: 10px;
		letter-spacing: 0;
		visibility: hidden;
		background-color: white;
		border-radius: 5px;
		opacity: 0;
		transition: all 0.3s;

		&.active {
			right: 40px;
			visibility: inherit;
			opacity: 1;
		}
	}
</style>
