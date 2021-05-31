<template lang="pug">
.d-manage-modal-control-data(v-if="screen.chooseWidgetId")
	d-right-swiper(title="数据请求", :show="true")
		// START_PROD
		d-right-control(label="数据类型")
			i-select(
				v-model="apiType",
				:style="{ width: apiType === '数仓平台' ? '122px' : '208px' }")
				i-option(value="静态数据") 静态数据
				i-option(value="API接口") API接口
				i-option(value="数仓平台") 数仓平台
			i-button.setting-btn(
				@click="openSystemConfig",
				type="primary",
				icon="md-settings",
				:style="{ marginLeft: '10px' }",
				v-if="apiType === '数仓平台'",
				:disabled="!screen.chooseWidget.config.api.system.enable") 配置
		d-right-control(label="接口地址", v-if="apiType === 'API接口'")
			i-input(
				v-model="screen.chooseWidget.config.api.url",
				@on-focus="event.inputFocus = true",
				@on-blur="event.inputFocus = false")
		d-right-control(v-if="apiType === 'API接口'")
			i-select(
				v-model="screen.chooseWidget.config.api.method",
				:style="{ marginRight: '10px', width: '100px' }")
				i-option(value="GET") GET
				i-option(value="POST") POST
				i-option(value="PUT") PUT
				i-option(value="DELETE") DELETE
				i-option(value="PATCH") PATCH
			i-input(
				v-model="screen.chooseWidget.config.api.path",
				:style="{ width: '100px' }",
				@on-focus="event.inputFocus = true",
				@on-blur="event.inputFocus = false")
		d-right-control(
			label="接口地址",
			v-if="screen.chooseWidget.config.api.system.enable")
			i-input(
				v-model="screen.chooseWidget.config.api.system.interface",
				@on-focus="event.inputFocus = true",
				@on-blur="event.inputFocus = false")
		d-right-control(v-if="screen.chooseWidget.config.api.system.enable")
			i-select(
				v-model="screen.chooseWidget.config.api.system.method",
				:style="{ marginRight: '10px', width: '100px' }")
				i-option(value="GET") GET
				i-option(value="POST") POST
				i-option(value="PUT") PUT
				i-option(value="DELETE") DELETE
				i-option(value="PATCH") PATCH
			i-input(
				v-model="screen.chooseWidget.config.api.system.path",
				:style="{ width: '100px' }",
				@on-focus="event.inputFocus = true",
				@on-blur="event.inputFocus = false")
			database-config(
				ref="dataBaseConfig",
				:showModal="showDatabaseConfigModal",
				@close="showDatabaseConfigModal = false",
				@update="updateApiSystem",
				@keyup.native.stop)
		d-code(
			label="请求参数",
			lang="json",
			:code="typeof screen.chooseWidget.config.api.params === 'string' ? screen.chooseWidget.config.api.params : JSON.stringify(screen.chooseWidget.config.api.params)",
			@update:code="value => (screen.chooseWidget.config.api.params = JSON.parse(value))")
		// END_PROD
		d-code(
			label="响应数据",
			lang="json",
			:code="apiData",
			@update:code="value => (apiData = value)")
	// START_PROD
	d-right-swiper-eye(
		title="数据过滤器",
		:enable="screen.chooseWidget.config.api.process.enable",
		@open-click="screen.chooseWidget.config.api.process.enable = true",
		@close-click="screen.chooseWidget.config.api.process.enable = false")
		d-code(
			label="数据过滤器",
			:code="screen.chooseWidget.config.api.process.methodBody",
			@update:code="value => (screen.chooseWidget.config.api.process.methodBody = value)")
	d-right-swiper-eye(
		title="自动更新",
		:enable="screen.chooseWidget.config.api.autoFetch.enable",
		@open-click="screen.chooseWidget.config.api.autoFetch.enable = true",
		@close-click="screen.chooseWidget.config.api.autoFetch.enable = false")
		d-right-control
			i-input-number(
				:min="1",
				:step="1",
				@on-focus="event.inputFocus = true",
				@on-blur="event.inputFocus = false",
				:formatter="value => `${value} ms`",
				v-model="screen.chooseWidget.config.api.autoFetch.duration")
	// END_PROD
	data-event-component
	data-event-scene
	d-right-control(label="开启组件内部事件")
		i-switch(v-model="event.componentsDisabled[platform.chooseWidgetId]")
	d-right-control(label="组件关联")
		i-switch(v-model="screen.chooseWidget.config.api.bind.enable")
		i-select(
			v-if="screen.chooseWidget.config.api.bind.enable",
			v-model="screen.chooseWidget.config.api.bind.refIds",
			filterable,
			multiple,
			:style="{ width: '100px', marginLeft: '10px' }")
			i-option(
				:value="screen.chooseWidget.id",
				v-for="(item, key) in relateList",
				:key="key") {{ item.id }}
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import databaseConfig from '../components/data-warehouse/index.vue'
import dCode from '../components/d-code/index.vue'
import { animates } from './config.js'
import DataEventComponent from './data-event-component.vue'
import DataEventScene from './data-event-scene.vue'

@Component({
	components: { DataEventScene, DataEventComponent, databaseConfig, dCode },
})
export default class FuncData extends func {
	animates = animates
	eventModal = false
	// START_PROD
	showDatabaseConfigModal = false
	screen = {}
	get apiType() {
		if (this.screen.chooseWidget.config.api.system.enable) {
			return '数仓平台'
		} else if (this.screen.chooseWidget.config.api.url) {
			return 'API接口'
		} else {
			return '静态数据'
		}
	}

	set apiType(val) {
		if (val === '数仓平台') {
			this.screen.chooseWidget.config.api.system.enable = true
			this.screen.chooseWidget.config.api.url = ''
		} else if (val === '静态数据') {
			this.screen.chooseWidget.config.api.url = ''
			this.screen.chooseWidget.config.api.system.enable = false
		} else {
			this.screen.chooseWidget.config.api.url = '/'
			this.screen.chooseWidget.config.api.system.enable = false
		}
	}
	// END_PROD

	get apiData() {
		const req = this.getItemValue('config.api.data')
		if (typeof req === 'object') {
			try {
				return JSON.stringify(req, null, '\t')
			} catch (e) {
				console.warn(e)
			}
		} else {
			if (req) {
				try {
					return JSON.stringify(JSON.parse(req), null, '\t')
				} catch (e) {
					console.warn(e)
				}
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
					`${this.screen.chooseWidget.config.widget.name} ${this.screen.chooseWidget.config.widget.componentVersion} JSON 格式化 响应数据有错误信息！！！`,
				)
				console.log(err.stack)
			}
		} else {
			data[prop] = ''
		}
	}

	get relateList() {
		const list = Object.values(this.platform.widgetAdded)
			.filter(
				(v: any) =>
					v.config.api.bind.enable &&
					v.scene === this.screen.sceneIndex,
			)
			.map((v: any) => {
				const { id, name } = v.config.widget
				return { id, name }
			})
		return list
	}

	// START_PROD
	updateApiSystem(value) {
		Object.assign(this.screen.chooseWidget.config.api.system.params, value)
		this.showDatabaseConfigModal = false
	}

	openSystemConfig() {
		const value = this.screen.chooseWidget.config
		if (!value) return
		this.showDatabaseConfigModal = true
		this.screen = this.$screen
		// @ts-ignore
		this.$refs.dataBaseConfig.setQueryCond(value.api.system.params)
	}
	// END_PROD
}
</script>
