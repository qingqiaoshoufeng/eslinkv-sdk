<template lang="pug">
.d-right-modal.d-scrollbar
	.d-manage-modal-control
		label 屏幕大小
		.d-manage-modal-control-right
			i-select(v-model="size")
				i-option(value="1920*1080") 大屏推荐尺寸1920*1080
				i-option(value="1366*768") web最常见尺寸1366*768
				i-option(value="1024*768") web最小尺寸1024*768
				i-option(value="other") 自定义
	.d-manage-modal-control
		label
		.d-manage-modal-control-right
			i-input-number(
				:min="1",
				:step="1",
				:formatter="value => `W:${value}`",
				v-model="platform.panelConfig.size.width",
				:style="{ marginRight: '10px', width: '67px' }",
				:parser="value => value.replace('W:', '')")
			i-input-number(
				:min="1",
				:step="1",
				:formatter="value => `h:${value}`",
				v-model="platform.panelConfig.size.height",
				:style="{ marginRight: '10px', width: '67px' }",
				:parser="value => value.replace('h:', '')")
			i-select(
				v-model="platform.panelConfig.size.unit",
				:style="{ width: '55px' }")
				i-option(value="px") px
				i-option(value="%") %
				i-option(value="vw/vh") vw/vh
	.d-manage-modal-control
		label 背景色
		.d-manage-modal-control-right
			i-color-picker(
				:alpha="true",
				v-model="platform.panelConfig.background.color")
			i-input(
				v-model="platform.panelConfig.background.color",
				:disabled="true",
				:style="{ width: '166px', marginLeft: '10px' }")
	.d-manage-modal-control
		label 背景图
		.d-manage-modal-control-right
			d-upload(
				v-model="platform.panelConfig.background.url",
				:data="backGroundFormData")
	.d-manage-modal-control
		label 移动看板
		.d-manage-modal-control-right
			i-switch(v-model="platform.panelConfig.size.isMobile")
	.d-manage-modal-control
		label 适配模式
		.d-manage-modal-control-right
			i-select(v-model="platform.panelConfig.size.layoutMode")
				i-option(value="full-size") 充满页面
				i-option(value="full-width") 100%宽度
				i-option(value="full-height") 100%高度
	.d-manage-modal-control
		label 首场景
		.d-manage-modal-control-right
			i-select(v-model="platform.panelConfig.mainScene", filterable)
				i-option(:value="0") 主场景
				i-option(:value="key", v-for="(item, key) in scene.obj", :key="key") {{ item.name }}
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import platform from '../store/platform.store.js'
import scene from '../store/scene.store.js'
import dUpload from '../components/d-upload/index.vue'

@Component({
	components: {
		dUpload,
	},
})
export default class FuncConfig extends func {
	platform = platform.state
	scene = scene.state
	backGroundFormData = {
		library: 'componentBackGround',
	}

	get size() {
		const width = this.platform.panelConfig.size.width
		const height = this.platform.panelConfig.size.height
		if (width !== 1920 && width !== 1366 && width !== 1024) {
			return 'other'
		}
		if (height !== 1080 && height !== 768) {
			return 'other'
		}
		return `${width}*${height}`
	}

	set size(value) {
		if (value !== 'other' && value) {
			const [width, height] = value.split('*')
			this.platform.panelConfig.size.width = +width
			this.platform.panelConfig.size.height = +height
		}
	}
}
</script>
