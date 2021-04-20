<template lang="pug">
.d-right-swiper
	.d-right-swiper-title.pointer.fn-flex.flex-row(
		:class="{ active }",
		@click="active = !active")
		i-icon.pointer.d-right-swiper-title-down.fn-flex(type="ios-arrow-down")
		label.pointer {{ title }}
		.d-right-swiper-title-right.fn-flex.flex-row
			i-icon.pointer(v-for="item in icon")(
				:type="item",
				@click="handleIconClick(item)",
				size="14",
				@click.stop)
	.d-right-swiper-content(
		:class="{ active }",
		:style="{ height: active ? '' : '0' }")
		slot
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Icon } from 'view-design'

@Component({
	components: {
		'i-icon': Icon,
	},
})
export default class DRightSwiper extends Vue {
	@Prop() title: string
	@Prop() icon: []
	@Prop({ default: false }) show: boolean

	// @ts-ignore
	active = this.show
	handleIconClick(value) {
		this.$emit('icon-click', value)
	}
}
</script>
<style lang="scss" scoped>
.d-right-swiper-content {
	overflow: hidden;
	transition: all 0.3s;
	&.active {
		margin-top: 10px;
	}
}
.d-right-swiper {
	+ .d-right-swiper {
		.d-right-swiper-title {
			border-top: none;
		}
	}
	&::v-deep + .d-manage-modal-control-base {
		margin-top: 10px;
	}
	&::v-deep + .d-manage-modal-control {
		margin-top: 10px;
	}
}
.d-right-swiper-title {
	border-top: 1px solid rgb(57, 59, 74);
	border-bottom: 1px solid rgb(57, 59, 74);
	height: 36px;
	line-height: 36px;
	background-color: #2d2f38;
	align-items: center;
	label {
		color: rgb(250, 250, 250);
		font-size: 12px;
		line-height: 36px;
		margin-left: 10px;
		user-select: none;
	}
	.ivu-icon {
		width: 12px;
		font-size: 12px;
		color: rgb(250, 250, 250);
	}
	.d-right-swiper-title-right {
		margin-left: auto;
		margin-right: 10px;
		.ivu-icon {
			margin-left: 10px;
		}
	}
	.d-right-swiper-title-down {
		transition: all 0.3s;
		margin-left: 10px;
		width: 12px;
		height: 12px;
		transform: rotate(-90deg);
	}
	&.active {
		.d-right-swiper-title-down {
			transform: rotate(0);
		}
	}
}
</style>
