<template lang="pug">
	.d-manage-modal-control-data
		.fn-flex.flex-row.d-manage-modal-control-more
			.d-manage-modal-control
				label 接口地址
				i-input(v-model="item.config.api.url" :disabled="platform.chooseWidgetState")
			.d-manage-modal-control
				label 请求方式
				i-select(v-model="item.config.api.method" :disabled="platform.chooseWidgetState")
					i-option(value="GET") GET
					i-option(value="POST") POST
					i-option(value="PUT") PUT
					i-option(value="DELETE") DELETE
					i-option(value="PATCH") PATCH
			.d-manage-modal-control
				label 数据路径
				i-input(v-model="item.config.api.path" :disabled="platform.chooseWidgetState")
		.d-manage-modal-control
			label 请求参数
			editor.d-manage-modal-control-editor(v-model="item.config.api.params" @init="editorInit" lang="json" theme="chrome" height="100")
		.d-manage-modal-control
			label 响应数据
			editor.d-manage-modal-control-editor(v-model="apiData" @init="editorInit" lang="json" theme="chrome" height="100")
		.d-manage-modal-control
			label 数据加工
			i-switch(v-model="item.config.api.process.enable" :disabled="platform.chooseWidgetState")
		.d-manage-modal-control(v-if="item.config.api.process.enable")
			label 加工CODE
			editor.d-manage-modal-control-editor(v-model="item.config.api.process.methodBody" @init="editorInit" lang="javascript" theme="chrome" height="100")
		.fn-flex.flex-row.d-manage-modal-control-more
			.d-manage-modal-control
				label 定时刷新
				i-switch(v-model="item.config.api.autoFetch.enable" :disabled="platform.chooseWidgetState")
			.d-manage-modal-control(v-if="item.config.api.autoFetch.enable")
				label 刷新间隔
				i-input-number(:min="1" :step="1" v-model="item.config.api.autoFetch.duration" :disabled="platform.chooseWidgetState")
		.d-manage-modal-control
			label 数仓接口
			.setting
				i-switch(v-model="item.config.api.system.enable" :disabled="platform.chooseWidgetState")
				i-button.setting-btn(
					@click="openSystemConfig"
					type="primary"
					icon="md-settings"
					:disabled="platform.chooseWidgetState || !item.config.api.system.enable"
				) 配置
		template(v-if="item.config.api.system.enable")
			.fn-flex.flex-row.d-manage-modal-control-more
				.d-manage-modal-control
					label 接口地址
					i-input(v-model="item.config.api.system.interface" :disabled="platform.chooseWidgetState")
				.d-manage-modal-control
					label 请求方式
					i-select(v-model="item.config.api.system.method" :disabled="platform.chooseWidgetState")
						i-option(value="GET") GET
						i-option(value="POST") POST
						i-option(value="PUT") PUT
						i-option(value="DELETE") DELETE
						i-option(value="PATCH") PATCH
				.d-manage-modal-control
					label 数据路径
					i-input(v-model="item.config.api.system.path" :disabled="platform.chooseWidgetState")
					
			<!-- 数仓配置面板 -->
			database-config(
				ref="dataBaseConfig"
				:showModal="showDatabaseConfigModal"
				@close="showDatabaseConfigModal = false"
				@update="updateApiSystem"
				@keyup.native.stop
			)
		.d-manage-modal-control
			label 组件关联
			i-switch(v-model="item.config.api.bind.enable" :disabled="platform.chooseWidgetState")
		.d-manage-modal-control(v-if="item.config.api.bind.enable")
			checkbox-group(v-model="item.config.api.bind.refIds")
				checkbox(:label="k.id" v-for="(k, i) in relateList" :key="i") {{k.name}}
			

</template>
<script lang="ts">
	import func from './func.mx'
	import { Component } from 'vue-property-decorator'
	import databaseConfig from '../components/data-warehouse/index.vue'
	import scene from '../store/scene.store'

	@Component({ components: { databaseConfig } })
	export default class FuncData extends func {
		showDatabaseConfigModal = false
		
		get apiData () {
			return this.getJson('config.api.data')
		}
		
		set apiData (v) {
			return this.setJson(v, 'config.api.data')
		}

		get relateList () {
			const list = Object.values(this.platform.widgetAdded)
				.filter(v => v.config.api.bind.enable && v.scene === scene.state.index)
				.map(v => {
					const { id, name } = v.config.widget
					return {
						id,
						name
					}
				})
			return list
		}
		
		updateApiSystem (value) {
			Object.assign(this.item.config.api.system.params, value)
			this.showDatabaseConfigModal = false
		}

		openSystemConfig () {
			const value = this.item.config
			if (!value) return
			const api = value.api
			if (!api || !api.system) {
				this.$Message.warning('当前小工具不支持数仓配置！')
				return
			}
			this.showDatabaseConfigModal = true
			this.$refs.dataBaseConfig.setQueryCond(value.api.system.params)
		}
	}
</script>

<style scoped lang="scss">
.setting {
	display: flex;
	align-items: center;

	.setting-btn {
		margin-bottom: 10px;
		margin-left: 20px;
	}
}
</style>
