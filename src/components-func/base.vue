<template lang="pug">
.d-manage-modal-control-base
	.d-manage-modal-control
		label 场景
		.d-manage-modal-control-right
			i-select(v-model="item.scene", :disabled="platform.chooseWidgetState")
				i-option(:value="0") 主场景
				i-option(:value="key", v-for="(item, key) in scene.obj", :key="key") {{ item.name }}
				i-option(:value="-1") 场景回收站
	.d-manage-modal-control(v-if="item.market")
		label 组件版本号
		.d-manage-modal-control-right
			i-select(
				v-model="item.config.widget.componentVersion",
				:disabled="platform.chooseWidgetState")
				i-option(
					:value="item.componentVersion",
					v-for="(item, i) in versionList",
					:key="i") {{ item.componentVersion }}
	.d-manage-modal-control
		label 定位
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
				v-model="item.config.layout.position.top",
				:formatter="value => `上:${value}`",
				:parser="value => value.replace('上:', '')",
				:disabled="platform.chooseWidgetState",
				:style="{ marginRight: '10px' }")
			i-input-number(
				v-model="item.config.layout.position.bottom",
				:formatter="value => `下:${value}`",
				:parser="value => value.replace('下:', '')",
				:disabled="platform.chooseWidgetState")
	.d-manage-modal-control
		label
		.d-manage-modal-control-right
			i-input-number(
				v-model="item.config.layout.position.left",
				:formatter="value => `左:${value}`",
				:parser="value => value.replace('左:', '')",
				:disabled="platform.chooseWidgetState",
				:style="{ marginRight: '10px' }")
			i-input-number(
				v-model="item.config.layout.position.right",
				:formatter="value => `右:${value}`",
				:parser="value => value.replace('右:', '')",
				:disabled="platform.chooseWidgetState")
	.d-manage-modal-control
		label 宽高
		.d-manage-modal-control-right
			i-input-number(
				:min="1",
				:step="1",
				:formatter="value => `w:${value}`",
				v-model="item.config.layout.size.width",
				:disabled="platform.chooseWidgetState",
				:parser="value => value.replace('w:', '')",
				:style="{ marginRight: '10px', width: '67px' }")
			i-input-number(
				:min="1",
				:step="1",
				:formatter="value => `h:${value}`",
				v-model="item.config.layout.size.height",
				:disabled="platform.chooseWidgetState",
				:parser="value => value.replace('h:', '')",
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
	.d-manage-modal-control
		label 透明度
		.d-manage-modal-control-right
			i-input-number(
				:min="0",
				:step="0.1",
				:max="1",
				v-model="item.config.layout.opacity",
				:disabled="platform.chooseWidgetState")
	.d-manage-modal-control
		label 内容溢出
		.d-manage-modal-control-right
			i-select(
				v-model="item.config.layout.overflow",
				:clearable="true",
				:disabled="platform.chooseWidgetState")
				i-option(value="visible") visible
				i-option(value="hidden") hidden
				i-option(value="scroll") scroll
				i-option(value="auto") auto
				i-option(value="inherit") inherit
	.d-manage-modal-control
		label 启用动画
		.d-manage-modal-control-right
			i-switch(
				v-model="item.config.animation.transitionEnable",
				:disabled="platform.chooseWidgetState")
	.d-manage-modal-control(v-if="item.config.animation.transitionEnable")
		label 入场效果
		.d-manage-modal-control-right
			i-select(
				v-model="item.config.animation.enter",
				:disabled="platform.chooseWidgetState")
				i-option(:value="k", v-for="k in animationEnterNames", :key="k") {{ k }}
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
	versionList = []
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

	async getVersionList() {
		const res = await this.$api.marketComponent.getVersionList({
			componentEnTitle: this.item.type,
		})
		this.versionList = res
	}

	created() {
		if (this.item.market) {
			this.getVersionList()
		}
	}
}
</script>
