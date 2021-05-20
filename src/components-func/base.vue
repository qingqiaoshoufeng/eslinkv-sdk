<template lang="pug">
.d-manage-modal-control-base
	d-right-swiper(title="基础属性", :show="true")
		d-right-control(label="位置")
			i-select(
				v-model="item.config.layout.position.value")
				i-option(value="absolute") 绝对定位
				i-option(value="fixed") 浮动定位
				i-option(value="relative") 相对定位
		d-right-control
			d-input(
				append="X",
				v-model="item.config.layout.position.left",
				:style="{ width: '100px', marginRight: '10px' }")
			d-input(
				append="Y",
				v-model="item.config.layout.position.top",
				:style="{ width: '100px'}")
		d-right-control(label="宽高")
			d-input(
				append="W",
				v-model="item.config.layout.size.width",
				:style="{ width: '100px', marginRight: '10px' }")
			d-input(
				append="H",
				v-model="item.config.layout.size.height",
				:style="{ width: '100px' }")
		d-right-control(label="场景")
			i-select(v-model="item.scene")
				i-option(:value="0") 主场景
				i-option(:value="key", v-for="(item, key) in scene.obj", :key="key") {{ item.name }}
				i-option(:value="-1") 回收站
		d-right-control(label="缩放比例")
			i-input(
				v-model="scale",
				@on-focus="event.inputFocus = true",
				@on-blur="event.inputFocus = false",
				:style="{ width: '100px' }")
	d-right-swiper-eye(
		title="载入动画",
		@open-click="item.config.animation.transitionEnable = true",
		@close-click="item.config.animation.transitionEnable = false",
		:enable="item.config.animation.transitionEnable")
		d-right-control(label="动画形式")
			i-select(
				v-model="item.config.animation.enter",)
				i-option(
					:value="k.value",
					v-for="k in animationEnterNames",
					:key="k.value") {{ k.label }}
		d-right-control(label="延时时长")
			d-input(append="ms", v-model="item.config.animation.delay")
		d-right-control(label="动画时长")
			d-input(append="ms", v-model="item.config.animation.duration")
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'

@Component
export default class FuncBase extends func {
	animationEnterNames: any[] = [
		{ label: '渐隐渐显', value: 'fadeIn' },
		{ label: '渐隐渐显+滑动向下', value: 'fadeInDown' },
		{ label: '渐隐渐显+滑动向左', value: 'fadeInLeft' },
		{ label: '渐隐渐显+滑动向右', value: 'fadeInRight' },
		{ label: '渐隐渐显+滑动向上', value: 'fadeInUp' },
		{ label: '渐隐渐显+滑动向左上', value: 'fadeInTopLeft' },
		{ label: '渐隐渐显+滑动向右上', value: 'fadeInTopRight' },
		{ label: '渐隐渐显+滑动向左下', value: 'fadeInBottomLeft' },
		{ label: '渐隐渐显+滑动向右下', value: 'fadeInBottomRight' },
		{ label: '滑动向下', value: 'slideInDown' },
		{ label: '滑动向左', value: 'slideInLeft' },
		{ label: '滑动向上', value: 'slideInUp' },
	]

	get scale() {
		return `${Math.round(this.item.config.layout.scale * 100)}%`
	}

	set scale(val: any) {
		if (!isNaN(val)) {
			this.item.config.layout.scale = val
		} else {
			const back = this.item.config.layout.scale
			if (val.indexOf('%') !== -1) {
				let v = val.replace('%', '') / 100
				if (!isNaN(v)) {
					this.item.config.layout.scale = v
				} else {
					this.item.config.layout.scale = back
				}
			}
		}
	}
}
</script>
