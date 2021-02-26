<template lang="pug">
	.d-manage-modal-control-style
		.d-manage-modal-control
			label 定位
			i-select(v-model="item.config.layout.position.value" :disabled="platform.chooseWidgetState")
				i-option(value="absolute") absolute
				i-option(value="fixed") fixed
				i-option(value="inherit") inherit
				i-option(value="initial") initial
				i-option(value="relative") relative
				i-option(value="revert") revert
				i-option(value="static") static
				i-option(value="sticky") sticky
				i-option(value="unset") unset
		.fn-flex.flex-row.d-manage-modal-control-more
			.d-manage-modal-control
				label 上
				i-input-number(v-model="item.config.layout.position.top" :disabled="platform.chooseWidgetState")
			.d-manage-modal-control
				label 下
				i-input-number(v-model="item.config.layout.position.bottom" :disabled="platform.chooseWidgetState")
			.d-manage-modal-control
				label 左
				i-input-number(v-model="item.config.layout.position.left" :disabled="platform.chooseWidgetState")
			.d-manage-modal-control
				label 右
				i-input-number(v-model="item.config.layout.position.right" :disabled="platform.chooseWidgetState")
			.d-manage-modal-control
				label 单位
				i-select(v-model="item.config.layout.position.unit" :disabled="platform.chooseWidgetState")
					i-option(value="px") px
					i-option(value="%") %
					i-option(value="rem") rem
					i-option(value="em") em
					i-option(value="vw") vw
					i-option(value="vh") vh
		.fn-flex.flex-row.d-manage-modal-control-more
			.d-manage-modal-control
				label 宽度
				i-input-number(:min="1" :step="1" v-model="item.config.layout.size.width" :disabled="platform.chooseWidgetState")
			.d-manage-modal-control
				label 高度
				i-input-number(:min="1" :step="1" v-model="item.config.layout.size.height" :disabled="platform.chooseWidgetState")
			.d-manage-modal-control
				label 单位
				i-select(v-model="item.config.layout.size.unit" :disabled="platform.chooseWidgetState")
					i-option(value="px") px
					i-option(value="%") %
					i-option(value="rem") rem
					i-option(value="em") em
					i-option(value="vw") vw
					i-option(value="vh") vh
		.fn-flex.flex-row.d-manage-modal-control-more
			.d-manage-modal-control
				label 层级
				i-input-number(:min="1" :step="1" v-model="item.config.layout.zIndex" :disabled="platform.chooseWidgetState")
			.d-manage-modal-control
				label 透明度
				i-input-number(:min="0" :step=".1" :max="1" v-model="item.config.layout.opacity" :disabled="platform.chooseWidgetState")
			.d-manage-modal-control
				label 内容溢出
				i-select(v-model="item.config.layout.overflow" :clearable="true" :disabled="platform.chooseWidgetState")
					i-option(value="visible") visible
					i-option(value="hidden") hidden
					i-option(value="scroll") scroll
					i-option(value="auto") auto
					i-option(value="inherit") inherit
</template>
<script lang="ts">
	import func from './func.mx'
	import {Component} from 'vue-property-decorator'

	@Component
	export default class FuncStyle extends func {
	}
</script>
<style lang="scss" scoped>
	.d-manage-modal-control-style {
		margin-bottom: 10px;
	}
</style>
