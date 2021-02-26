<template lang="pug">
	.d-manage-modal-control-base
		.d-manage-modal-control
			label 启用动画
			i-switch(v-model="item.config.animation.transitionEnable" :disabled="platform.chooseWidgetState")
		.d-manage-modal-control
			label 入场效果
			i-select(v-model="item.config.animation.enter" :disabled="platform.chooseWidgetState")
				i-option(:value="k" v-for="k in animationEnterNames" :key="k") {{k}}
		.d-manage-modal-control
			label 延时时长
			i-input-number(v-model="item.config.animation.delay" :disabled="platform.chooseWidgetState")
		.d-manage-modal-control
			label 动画时长
			i-input-number(v-model="item.config.animation.duration" :disabled="platform.chooseWidgetState")
</template>
<script lang="ts">
import func from './func.mx'
import {Component} from 'vue-property-decorator'

@Component
export default class FuncAnimation extends func {
	animationEnterNames: string[] = ['bounce', 'flash', 'pulse', 'rubberBand', 'shakeX', 'shakeY', 'headShake', 'swing', 'tada', 'wobble', 'jello', 'heartBeat', 'backInDown', 'backInLeft', 'backInRight', 'backInUp', 'bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp', 'fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp', 'fadeInUpBig', 'fadeInTopLeft', 'fadeInTopRight', 'fadeInBottomLeft', 'fadeInBottomRight', 'flipInX', 'flipInY', 'lightSpeedInRight', 'lightSpeedInLeft', 'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight', 'jackInTheBox', 'rollIn', 'zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp', 'slideInDown', 'slideInLeft', 'slideInRight', 'slideInUp']
}
</script>
