<template lang="pug">
	.d-manage-modal-control-base
		.fn-flex.flex-row.d-manage-modal-control-more
			.d-manage-modal-control
				label 组件id
				i-input(v-model="item.id" :disabled="true")
			.d-manage-modal-control
				label 组件类型
				i-input(v-model="item.type" :disabled="true")
		.d-manage-modal-control
			label 组件名称
			i-input(v-model="item.config.widget.name" :disabled="platform.chooseWidgetState")
		.fn-flex.flex-row.d-manage-modal-control-more
			.d-manage-modal-control
				label 组件市场
				i-switch(v-model="item.market" :disabled="true")
			.d-manage-modal-control
				label 锁定
				i-switch(v-model="item.config.widget.locked")
			.d-manage-modal-control
				label 隐藏
				i-switch(v-model="item.config.widget.hide")
		.d-manage-modal-control
			label 场景
			i-select(v-model="item.scene" :disabled="platform.chooseWidgetState")
				i-option(:value="0") 主场景
				i-option(:value="key" v-for="(item,key) in scene.obj" :key="key") {{item.name}}
				i-option(:value="-1") 场景回收站
</template>
<script lang="ts">
	import func from './func.mx'
	import { Component } from 'vue-property-decorator'

	// todo 组件市场的组件可以切换版本
	// ajax 获取版本列表切换
  // 并强制刷新当前组件
	@Component
	export default class FuncBase extends func {
	}
</script>
