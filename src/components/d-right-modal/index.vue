<template lang="pug">
	.d-right-modal-box.pos-a(:style="{top:`${top}px`}")
		.d-right.pos-a.pointer(@click="handleClick")
			i-icon(:type="icon" :title="title" size="28" :class="[{active:rightModal}]")
		.d-right-modal.pos-a(:class="[{active:rightModal}]" :style="{width:`${width}px`,top:`-${top-35}px`}" v-if="needModel")
			slot
</template>
<script lang="ts">
	import {Icon} from 'view-design'
	import {Component, Vue, Prop} from 'vue-property-decorator'
	import {findComponentsDownward} from '../../utils/index'
	
	@Component({
		components: {
			'i-icon': Icon
		},
	})
	export default class DRightModal extends Vue {
		rightModal: boolean = false
		@Prop({default: 470}) width: number
		@Prop({default: 'ios-construct'}) icon: string
		@Prop({default: '标题'}) title: string
		@Prop({default: 33}) top: number
		@Prop({default: true}) needModel: boolean


		handleClick() {
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
		width: 24px;
		height: 24px;
		right: 15px;
	}

	.d-right {
		right: 0;
		top: 0;
		z-index: 2;
		width: 24px;
		height: 24px;

		.ivu-icon {
			opacity: .6;
			color: $themeColor;

			&:hover, &.active {
				opacity: 1;
			}
		}
	}

	.d-right-modal {
		right: -380px;
		background-color: white;
		border-radius: 5px;
		z-index: 3;
		letter-spacing: 0;
		height: calc(100vh - 140px);
		transition: all .3s;
		visibility: hidden;
		opacity: 0;
		padding: 10px;

		&.active {
			visibility: inherit;
			right: 40px;
			opacity: 1;
		}
	}
</style>
