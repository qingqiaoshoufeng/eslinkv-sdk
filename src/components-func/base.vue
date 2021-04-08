<template lang="pug">
.d-manage-modal-control-base
	.d-manage-modal-control
		label 场景
		.d-manage-modal-control-right
			i-select(v-model="item.scene", :disabled="platform.chooseWidgetState")
				i-option(:value="0") 主场景
				i-option(:value="key", v-for="(item, key) in scene.obj", :key="key") {{ item.name }}
				i-option(:value="-1") 回收站
	d-right-swiper(title="基础属性")
		.d-manage-modal-control
			label 位置
			.d-manage-modal-control-right
				i-select(
					v-model="item.config.layout.position.value",
					:disabled="platform.chooseWidgetState",
					:style="{ width: '140px', marginRight: '10px' }")
					i-option(value="absolute") 绝对定位
					i-option(value="fixed") 浮动定位
					i-option(value="relative") 相对定位
				i-select(
					v-model="item.config.layout.position.unit",
					:disabled="platform.chooseWidgetState",
					:style="{ width: '60px' }")
					i-option(value="px") px
					i-option(value="%") %
					i-option(value="rem") rem
					i-option(value="em") em
					i-option(value="vw") vw
					i-option(value="vh") vh
		.d-manage-modal-control
			label
			.d-manage-modal-control-right
				i-input-number(
					v-model="item.config.layout.position.left",
					:formatter="value => `X:${value}`",
					:parser="value => value.replace('X:', '')",
					:disabled="platform.chooseWidgetState",
					:style="{ width: '100px', marginRight: '10px' }")
				i-input-number(
					v-model="item.config.layout.position.top",
					:formatter="value => `Y:${value}`",
					:parser="value => value.replace('Y:', '')",
					:disabled="platform.chooseWidgetState",
					:style="{ width: '100px' }")
		.d-manage-modal-control
			label 宽高
			.d-manage-modal-control-right
				i-input-number(
					:min="1",
					:step="1",
					:formatter="value => `W:${value}`",
					v-model="item.config.layout.size.width",
					:disabled="platform.chooseWidgetState",
					:parser="value => value.replace('W:', '')",
					:style="{ marginRight: '10px', width: '67px' }")
				i-input-number(
					:min="1",
					:step="1",
					:formatter="value => `H:${value}`",
					v-model="item.config.layout.size.height",
					:disabled="platform.chooseWidgetState",
					:parser="value => value.replace('H:', '')",
					:style="{ marginRight: '10px', width: '67px' }")
				i-select(
					v-model="item.config.layout.size.unit",
					:disabled="platform.chooseWidgetState",
					:style="{ width: '55px' }")
					i-option(value="px") px
					i-option(value="%") %
					i-option(value="rem") rem
					i-option(value="em") em
					i-option(value="vw") vw
					i-option(value="vh") vh
	d-right-swiper(title="载入动画")
		.d-manage-modal-control
			label 启用动画
			.d-manage-modal-control-right
				i-select(
					v-model="item.config.animation.enter",
					v-if="item.config.animation.transitionEnable",
					:style="{ marginRight: '10px', width: '156px' }",
					:disabled="platform.chooseWidgetState")
					i-option(:value="k", v-for="k in animationEnterNames", :key="k") {{ k }}
				i-switch(
					v-model="item.config.animation.transitionEnable",
					:disabled="platform.chooseWidgetState")
		.d-manage-modal-control(v-if="item.config.animation.transitionEnable")
			label 延时时长
			.d-manage-modal-control-right
				i-input-number(
					:formatter="value => `${value} ms`",
					:parser="value => value.replace('ms', '')",
					v-model="item.config.animation.delay",
					:disabled="platform.chooseWidgetState")
		.d-manage-modal-control(v-if="item.config.animation.transitionEnable")
			label 动画时长
			.d-manage-modal-control-right
				i-input-number(
					:formatter="value => `${value} ms`",
					:parser="value => value.replace('ms', '')",
					v-model="item.config.animation.duration",
					:disabled="platform.chooseWidgetState")
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'

@Component
export default class FuncBase extends func {
	animationEnterNames: string[] = [
		'bounce',
		'flash',
		'pulse',
		'rubberBand',
		'shakeX',
		'shakeY',
		'headShake',
		'swing',
		'tada',
		'wobble',
		'jello',
		'heartBeat',
		'backInDown',
		'backInLeft',
		'backInRight',
		'backInUp',
		'bounceIn',
		'bounceInDown',
		'bounceInLeft',
		'bounceInRight',
		'bounceInUp',
		'fadeIn',
		'fadeInDown',
		'fadeInDownBig',
		'fadeInLeft',
		'fadeInLeftBig',
		'fadeInRight',
		'fadeInRightBig',
		'fadeInUp',
		'fadeInUpBig',
		'fadeInTopLeft',
		'fadeInTopRight',
		'fadeInBottomLeft',
		'fadeInBottomRight',
		'flipInX',
		'flipInY',
		'lightSpeedInRight',
		'lightSpeedInLeft',
		'rotateIn',
		'rotateInDownLeft',
		'rotateInDownRight',
		'rotateInUpLeft',
		'rotateInUpRight',
		'jackInTheBox',
		'rollIn',
		'zoomIn',
		'zoomInDown',
		'zoomInLeft',
		'zoomInRight',
		'zoomInUp',
		'slideInDown',
		'slideInLeft',
		'slideInRight',
		'slideInUp',
	]
}
</script>
