<template lang="pug">
.d-manage-modal-control-data
	d-right-swiper(title="数据请求", :show="true")
		d-right-control(label="数据类型")
			i-select(v-model="apiType", :style="{ width: apiType === '数仓平台' ? '122px' : '208px' }")
				i-option(value="静态数据") 静态数据
				i-option(value="API接口") API接口
				i-option(value="数仓平台") 数仓平台
			i-button.setting-btn(
				@click="openSystemConfig",
				type="primary",
				icon="md-settings",
				:style="{ marginLeft: '10px' }",
				v-if="apiType === '数仓平台'",
				:disabled="!editor.currentWidget.config.api.system.enable") 配置
		d-right-control(label="接口地址", v-if="apiType === 'API接口'")
			i-input(v-model="editor.currentWidget.config.api.url")
		d-right-control(v-if="apiType === 'API接口'")
			i-select(v-model="editor.currentWidget.config.api.method", :style="{ marginRight: '10px', width: '100px' }")
				i-option(value="GET") GET
				i-option(value="POST") POST
				i-option(value="PUT") PUT
				i-option(value="DELETE") DELETE
				i-option(value="PATCH") PATCH
			i-input(v-model="editor.currentWidget.config.api.path", :style="{ width: '100px' }")
		d-right-control(label="接口地址", v-if="editor.currentWidget.config.api.system.enable")
			i-input(v-model="editor.currentWidget.config.api.system.interface")
		d-right-control(v-if="editor.currentWidget.config.api.system.enable")
			i-select(v-model="editor.currentWidget.config.api.system.method", :style="{ marginRight: '10px', width: '100px' }")
				i-option(value="GET") GET
				i-option(value="POST") POST
				i-option(value="PUT") PUT
				i-option(value="DELETE") DELETE
				i-option(value="PATCH") PATCH
			i-input(v-model="editor.currentWidget.config.api.system.path", :style="{ width: '100px' }")
			database-config(
				ref="dataBaseConfig",
				:showModal="showDatabaseConfigModal",
				@close="showDatabaseConfigModal = false",
				@update="updateApiSystem",
				@keyup.native.stop)
		d-code(
			label="请求参数",
			lang="json",
			:code="typeof editor.currentWidget.config.api.params === 'string' ? editor.currentWidget.config.api.params : JSON.stringify(editor.currentWidget.config.api.params)",
			@update:code="value => (editor.currentWidget.config.api.params = JSON.parse(value))")
		d-code(label="响应数据", lang="json", :code="apiData", @update:code="value => (apiData = value)")
	d-right-swiper-eye(
		title="数据过滤器",
		:enable="editor.currentWidget.config.api.process.enable",
		@open-click="editor.currentWidget.config.api.process.enable = true",
		@close-click="editor.currentWidget.config.api.process.enable = false")
		d-code(
			label="数据过滤器",
			:code="editor.currentWidget.config.api.process.methodBody",
			@update:code="value => (editor.currentWidget.config.api.process.methodBody = value)")
	data-custom-deal
	d-right-swiper-eye(
		title="自动更新",
		:enable="editor.currentWidget.config.api.autoFetch.enable",
		@open-click="editor.currentWidget.config.api.autoFetch.enable = true",
		@close-click="editor.currentWidget.config.api.autoFetch.enable = false")
		d-right-control
			i-input-number(
				:min="1",
				:step="1",
				:formatter="value => `${value} ms`",
				v-model="editor.currentWidget.config.api.autoFetch.duration")
</template>
<script lang="ts">
import func from '@/vue2/components-func/func.mx'
import { Component } from 'vue-property-decorator'
import databaseConfig from '../components-base/data-warehouse/index.vue'
import dCode from '@/vue2/components-right/d-code/index.vue'
import DataEvent from '@/vue2/components-right/data-event/index.vue'
import DataCustomDeal from '@/vue2/components-right/data-custom-deal/index.vue'

@Component({
	components: {
		DataCustomDeal,
		DataEvent,
		databaseConfig,
		dCode,
	},
})
export default class FuncData extends func {
	eventModal = false
	showDatabaseConfigModal = false
	get apiType() {
		if (this.editor.currentWidget.config.api.system.enable) {
			return '数仓平台'
		} else if (this.editor.currentWidget.config.api.url) {
			return 'API接口'
		} else {
			return '静态数据'
		}
	}

	set apiType(val) {
		if (val === '数仓平台') {
			this.editor.currentWidget.config.api.system.enable = true
			this.editor.currentWidget.config.api.url = ''
		} else if (val === '静态数据') {
			this.editor.currentWidget.config.api.url = ''
			this.editor.currentWidget.config.api.system.enable = false
		} else {
			this.editor.currentWidget.config.api.url = '/'
			this.editor.currentWidget.config.api.system.enable = false
		}
	}

	// eslint-disable-next-line getter-return
	get apiData() {
		const req = this.getItemValue('config.api.data')
		if (typeof req === 'object') {
			try {
				return JSON.stringify(req, null, '\t')
			} catch (e) {}
		} else {
			if (req) {
				try {
					return JSON.stringify(JSON.parse(req), null, '\t')
				} catch (e) {}
			}
			return ''
		}
	}

	set apiData(v) {
		const data = this.getItemObj('config.api.data')
		const prop = 'config.api.data'.split('.').reverse()[0]
		if (v) {
			try {
				data[prop] = JSON.stringify(JSON.parse(v))
			} catch (err) {
				console.log(
					`${this.editor.currentWidget.config.widget.name} ${this.editor.currentWidget.config.widget.componentVersion} JSON 格式化 响应数据有错误信息！！！`,
				)
				console.log(err.stack)
			}
		} else {
			data[prop] = ''
		}
	}

	updateApiSystem(value): void {
		Object.assign(this.editor.currentWidget.config.api.system.params, value)
		this.showDatabaseConfigModal = false
	}

	openSystemConfig(): void {
		const value = this.editor.currentWidget.config
		if (!value) return
		this.showDatabaseConfigModal = true
		;(this.$refs.dataBaseConfig as any).setQueryCond(value.api.system.params)
	}
}
</script>
