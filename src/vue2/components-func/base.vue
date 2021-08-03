<template lang="pug">
.d-manage-modal-control-base
	d-right-swiper(title="基础属性", :show="true")
		d-right-control(label="位置")
			i-select(v-model="editor.currentWidget.config.layout.position.value")
				i-option(value="absolute") 绝对定位
				i-option(value="fixed") 浮动定位
				i-option(value="relative") 相对定位
		d-right-control
			d-input(
				append="X",
				v-model="editor.currentWidget.config.layout.position.left",
				:style="{ width: '100px', marginRight: '10px' }")
			d-input(append="Y", v-model="editor.currentWidget.config.layout.position.top", :style="{ width: '100px' }")
		d-right-control(label="宽高")
			d-input(
				append="W",
				v-model="editor.currentWidget.config.layout.size.width",
				:style="{ width: '100px', marginRight: '10px' }")
			d-input(append="H", v-model="editor.currentWidget.config.layout.size.height", :style="{ width: '100px' }")
		d-right-control(label="场景")
			i-select(v-model="editor.currentWidget.scene")
				i-option(:value="0") 主场景
				i-option(:value="key", v-for="(item, key) in editor.sceneObj", :key="key") {{ item.name }}
				i-option(:value="-1") 回收站
		d-right-control(label="缩放比例")
			i-input(v-model="scale", :style="{ width: '100px' }")
	d-right-swiper-eye(
		title="动画设置",
		@open-click="editor.currentWidget.animation.transitionEnable = true",
		@close-click="editor.currentWidget.animation.transitionEnable = false",
		:enable="editor.currentWidget.animation.transitionEnable")
		d-right-control(label="动画形式")
			i-select(v-model="editor.currentWidget.animation.type")
				i-option(:value="k.value", v-for="k in animationEnterNames", :key="k.value") {{ k.label }}
		d-right-control(label="入场动画时长")
			d-input(append="ms", v-model="editor.currentWidget.animation.enter")
		d-right-control(label="出场动画时长")
			d-input(append="ms", v-model="editor.currentWidget.animation.leave")
	//d-right-echarts
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import dRightEcharts from '../components-right/d-right-echarts/index.vue'

@Component({
	components: {
		dRightEcharts,
	},
})
export default class FuncBase extends func {
	animationEnterNames: any[] = [
		{ label: '渐隐渐显', value: 'fadeIn' },
		{ label: '渐隐渐显+从左至右滑动', value: 'fadeInLeft' },
		{ label: '渐隐渐显+从右至左滑动', value: 'fadeInRight' },
		{ label: '渐隐渐显+从上至下滑动', value: 'fadeInDown' },
		{ label: '渐隐渐显+从下至上滑动', value: 'fadeInUp' },
		{ label: '渐隐渐显+从左上至右下滑动', value: 'fadeInTopLeft' },
		{ label: '渐隐渐显+从右上至左下滑动', value: 'fadeInTopRight' },
		{ label: '渐隐渐显+从左下至右上滑动', value: 'fadeInBottomLeft' },
		{ label: '渐隐渐显+从右下至左上滑动', value: 'fadeInBottomRight' },
		{ label: '从左至右滑动', value: 'slideInLeft' },
		{ label: '从右至左滑动', value: 'slideInRight' },
		{ label: '从上至下滑动', value: 'slideInDown' },
		{ label: '从下至上滑动', value: 'slideInUp' },
	]

	get scale() {
		return `${Math.round(this.editor.currentWidget.config.layout.scale * 100)}%`
	}

	set scale(val: any) {
		if (!isNaN(val)) {
			this.editor.currentWidget.config.layout.scale = val
		} else {
			const back = this.editor.currentWidget.config.layout.scale
			if (val.indexOf('%') !== -1) {
				let v = val.replace('%', '') / 100
				if (!isNaN(v)) {
					this.editor.currentWidget.config.layout.scale = v
				} else {
					this.editor.currentWidget.config.layout.scale = back
				}
			}
		}
	}
}
</script>
