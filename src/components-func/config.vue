<template lang="pug">
	.d-manage-modal-control-config
		.d-manage-modal-control
			label 看板id
			i-input(v-model="platform.panelConfig.id" :disabled="true")
		.d-manage-modal-control
			label 看板名称
			i-input(v-model="platform.panelConfig.info.name")
		.d-manage-modal-control
			label 看板描述
			i-input(v-model="platform.panelConfig.info.remark")
		.fn-flex.flex-row.d-manage-modal-control-more
			.d-manage-modal-control
				label 宽度
				i-input-number(:min="1" :step="1" v-model="platform.panelConfig.size.width")
			.d-manage-modal-control
				label 高度
				i-input-number(:min="1" :step="1" v-model="platform.panelConfig.size.height")
			.d-manage-modal-control
				label 单位
				i-select(v-model="platform.panelConfig.size.unit")
					i-option(value="px") px
					i-option(value="%") %
					i-option(value="vw/vh") vw/vh
		.d-manage-modal-control
			label 常规尺寸
			i-select(@on-change="sizeChange")
				i-option(value="1920×1080") 1920×1080
				i-option(value="1600×900") 1600×900
				i-option(value="1366×768") 1366×768
				i-option(value="1080×1920") 1080×1920
				i-option(value="2560×1600") 2560×1600
		.fn-flex.flex-row.d-manage-modal-control-more
			.d-manage-modal-control
				label 背景色
				i-colorPicker(:alpha="true" v-model="platform.panelConfig.background.color")
			.d-manage-modal-control
				label 背景图片url地址
				i-input(v-model="platform.panelConfig.background.url")
		.d-manage-modal-control
			label 背景图片重复
			i-select(v-model="platform.panelConfig.background.repeat")
				i-option(value="repeat") repeat
				i-option(value="no-repeat") no-repeat
				i-option(value="repeat-x") repeat-x
				i-option(value="repeat-y") repeat-y
				i-option(value="space") space
				i-option(value="round") round
		.fn-flex.flex-row.d-manage-modal-control-more
			.d-manage-modal-control
				label 背景图片尺寸
				i-select(v-model="platform.panelConfig.background.size")
					i-option(value="cover") cover
					i-option(value="contain") contain
					i-option(value="auto") auto
			.d-manage-modal-control
				label 自定义
				i-input(v-model="platform.panelConfig.background.size")
		.fn-flex.flex-row.d-manage-modal-control-more
			.d-manage-modal-control
				label 背景图片位置
				i-select(v-model="platform.panelConfig.background.position")
					i-option(value="center") center
					i-option(value="left") left
					i-option(value="right") right
					i-option(value="top") top
					i-option(value="bottom") bottom
			.d-manage-modal-control
				label 自定义
				i-input(v-model="platform.panelConfig.background.position")
		.fn-flex.flex-row.d-manage-modal-control-more
			.d-manage-modal-control
				label 移动看板
				i-switch(v-model="platform.panelConfig.size.isMobileKanboard")
			.d-manage-modal-control(v-if="platform.panelConfig.size.isMobileKanboard")
				label 设备类型
				i-select(v-model="platform.panelConfig.size.deviceType")
					i-option(value="mobile") 手机
					i-option(value="pad") 平板
			.d-manage-modal-control(v-if="platform.panelConfig.size.isMobileKanboard")
				label 布局模式
				i-select(v-model="platform.panelConfig.size.layoutMode")
					i-option(value="full-size") 充满页面
					i-option(value="full-width") 100%宽度
					i-option(value="full-height") 100%高度
</template>
<script lang="ts">
	import func from './func.mx'
	import { Component } from 'vue-property-decorator'

	@Component
	export default class FuncConfig extends func {
		sizeChange (value) {
			if (value === undefined) return
			if (value) {
				const [width, height] = value.split('×')
				if (width !== 'null') this.platform.panelConfig.size.width = +width
				if (height !== 'null') this.platform.panelConfig.size.height = +height
			} else {
				this.platform.panelConfig.size.width = 1920
				this.platform.panelConfig.size.height = 1080
			}
		}
	}
</script>
<style lang="scss" scoped>
	.d-manage-modal-control-config {
		margin-bottom: 10px;

		/deep/ {
			.ivu-color-picker-confirm {
				.ivu-btn-default {
					margin-right: 5px;
				}
			}
		}
	}
</style>
