<template lang="pug">
.d-right-swiper
	.d-right-swiper-title.pointer.fn-flex.flex-row(
		:class="{ active }",
		@click="active = !active")
		i-icon.pointer.d-right-swiper-title-down.fn-flex(type="ios-arrow-down")
		label.pointer {{ title }}
		.d-right-swiper-title-right.fn-flex.flex-row
			i-tooltip(v-for="item in icon", :content="item.msg")
				i-icon.pointer(
					:type="item.icon",
					@click="handleIconClick(item.icon)",
					size="14",
					@click.stop)
	.d-right-swiper-content(
		:class="{ active }",
		:style="{ height: active ? '' : '0' }")
		slot
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Icon, Tooltip } from 'view-design'

@Component({
	components: {
		'i-icon': Icon,
		'i-tooltip': Tooltip,
	},
})
export default class DRightSwiper extends Vue {
	@Prop() title: string
	@Prop() icon: []
	@Prop({ default: false }) show: boolean

	// @ts-ignore
	active = this.show
	handleIconClick(value) {
		this.active = true
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

	/deep/ + .d-manage-modal-control-base {
		margin-top: 10px;
	}

	/deep/ + .d-manage-modal-control {
		margin-top: 10px;
	}
}

.d-right-swiper-title {
	align-items: center;
	height: 36px;
	line-height: 36px;
	background-color: #2d2f38;
	border-top: 1px solid rgb(57, 59, 74);
	border-bottom: 1px solid rgb(57, 59, 74);

	label {
		margin-left: 10px;
		font-size: 12px;
		line-height: 36px;
		color: rgb(250, 250, 250);
		user-select: none;
	}

	.ivu-icon {
		width: 12px;
		font-size: 12px;
		color: rgb(250, 250, 250);
	}

	.d-right-swiper-title-right {
		margin-right: 10px;
		margin-left: auto;

		.ivu-icon {
			margin-left: 10px;
		}
	}

	.d-right-swiper-title-down {
		width: 12px;
		height: 12px;
		margin-left: 10px;
		transition: all 0.3s;
		transform: rotate(-90deg);
	}

	&.active {
		.d-right-swiper-title-down {
			transform: rotate(0);
		}
	}
}
</style>
