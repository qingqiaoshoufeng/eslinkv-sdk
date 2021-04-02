<template lang="pug">
.d-manage-modal-control-data
	.d-manage-modal-control
		label 请求方式
		.d-manage-modal-control-right
			i-select(
				v-model="apiType",
				:disabled="platform.chooseWidgetState",
				@on-change="apiTypeChange")
				i-option(value="无") 无
				i-option(value="自定义URL") 自定义URL
				i-option(value="数仓平台") 数仓平台
	.d-manage-modal-control(v-if="apiType === '自定义URL'")
		label 接口地址
		.d-manage-modal-control-right
			i-input(
				v-model="item.config.api.url",
				:disabled="platform.chooseWidgetState")
	.d-manage-modal-control(v-if="apiType === '自定义URL'")
		label
		.d-manage-modal-control-right
			i-select(
				v-model="item.config.api.method",
				:disabled="platform.chooseWidgetState",
				:style="{ marginRight: '10px' }")
				i-option(value="GET") GET
				i-option(value="POST") POST
				i-option(value="PUT") PUT
				i-option(value="DELETE") DELETE
				i-option(value="PATCH") PATCH
			i-input(
				v-model="item.config.api.path",
				:disabled="platform.chooseWidgetState")
	.d-manage-modal-control(v-if="apiType === '数仓平台'")
		label 数仓接口
		.d-manage-modal-control-right
			i-button.setting-btn(
				@click="openSystemConfig",
				type="primary",
				icon="md-settings",
				:disabled="platform.chooseWidgetState || !item.config.api.system.enable") 配置
	.d-manage-modal-control(v-if="item.config.api.system.enable")
		label 接口地址
		.d-manage-modal-control-right
			i-input(
				v-model="item.config.api.system.interface",
				:disabled="platform.chooseWidgetState")
	.d-manage-modal-control(v-if="item.config.api.system.enable")
		label
		.d-manage-modal-control-right
			i-select(
				v-model="item.config.api.system.method",
				:disabled="platform.chooseWidgetState",
				:style="{ marginRight: '10px' }")
				i-option(value="GET") GET
				i-option(value="POST") POST
				i-option(value="PUT") PUT
				i-option(value="DELETE") DELETE
				i-option(value="PATCH") PATCH
			i-input(
				v-model="item.config.api.system.path",
				:disabled="platform.chooseWidgetState")
			database-config(
				ref="dataBaseConfig",
				:showModal="showDatabaseConfigModal",
				@close="showDatabaseConfigModal = false",
				@update="updateApiSystem",
				@keyup.native.stop)
	.d-manage-modal-control
		label 请求参数
	.d-manage-modal-control
		editor.d-manage-modal-control-editor(
			v-model="item.config.api.params",
			@init="editorInit",
			lang="json",
			theme="chrome",
			height="100")
	.d-manage-modal-control
		label 响应数据
	.d-manage-modal-control
		editor.d-manage-modal-control-editor(
			v-model="apiData",
			@init="editorInit",
			lang="json",
			theme="chrome",
			height="100")
	.d-manage-modal-control
		label 数据加工
		.d-manage-modal-control-right
			i-switch(
				v-model="item.config.api.process.enable",
				:disabled="platform.chooseWidgetState")
	.d-manage-modal-control(v-if="item.config.api.process.enable")
		editor.d-manage-modal-control-editor(
			v-model="item.config.api.process.methodBody",
			@init="editorInit",
			lang="javascript",
			theme="chrome",
			height="100")
	.d-manage-modal-control
		label 定时刷新
		.d-manage-modal-control-right
			i-switch(
				v-model="item.config.api.autoFetch.enable",
				:disabled="platform.chooseWidgetState")
	.d-manage-modal-control(v-if="item.config.api.autoFetch.enable")
		label
		.d-manage-modal-control-right
			i-input-number(
				:min="1",
				:step="1",
				:formatter="value => `${value} ms`",
				v-model="item.config.api.autoFetch.duration",
				:disabled="platform.chooseWidgetState")
	.d-manage-modal-control
		label 组件关联
		.d-manage-modal-control-right
			i-switch(
				v-model="item.config.api.bind.enable",
				:disabled="platform.chooseWidgetState")
	.d-manage-modal-control(v-if="item.config.api.bind.enable")
		checkbox-group(v-model="item.config.api.bind.refIds")
			checkbox(:label="k.id", v-for="(k, i) in relateList", :key="i") {{ k.name }}
</template>
<script lang="ts">
import func from './func.mx'
import { Component, Watch } from 'vue-property-decorator'
import databaseConfig from '../components/data-warehouse/index.vue'
import scene from '../store/scene.store'

@Component({ components: { databaseConfig } })
export default class FuncData extends func {
	showDatabaseConfigModal = false
	apiType = '无'

	@Watch('platform.chooseWidgetId')
	onChooseWidgetId() {
		if (this.item.config.api.system.enable) {
			this.apiType = '数仓平台'
		} else if (this.item.config.api.url) {
			this.apiType = '自定义URL'
		} else {
			this.apiType = '无'
		}
	}

	get apiData() {
		return this.getJson('config.api.data')
	}

	set apiData(v) {
		this.setJson(v, 'config.api.data')
	}

	get relateList() {
		const list = Object.values(this.platform.widgetAdded)
			.filter(
				v =>
					(v as any).config.api.bind.enable &&
					(v as any).scene === scene.state.index,
			)
			.map(v => {
				const { id, name } = (v as any).config.widget
				return { id, name }
			})
		return list
	}

	apiTypeChange(name) {
		if (name === '数仓平台') {
			this.item.config.api.system.enable = true
		} else {
			this.item.config.api.system.enable = false
		}
	}

	updateApiSystem(value) {
		Object.assign(this.item.config.api.system.params, value)
		this.showDatabaseConfigModal = false
	}

	openSystemConfig() {
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
