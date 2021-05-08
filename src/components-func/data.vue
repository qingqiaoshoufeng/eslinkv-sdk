<template lang="pug">
.d-manage-modal-control-data
	d-right-swiper(title="数据请求", :show="true")
		// START_PROD
		.d-manage-modal-control
			label 请求方式
			.d-manage-modal-control-right
				i-select(
					v-model="apiType",
					:style="{ width: apiType === '数仓平台' ? '122px' : '208px' }")
					i-option(value="无") 无
					i-option(value="自定义URL") 自定义URL
					i-option(value="数仓平台") 数仓平台
				i-button.setting-btn(
					@click="openSystemConfig",
					type="primary",
					icon="md-settings",
					:style="{ marginLeft: '10px' }",
					v-if="apiType === '数仓平台'",
					:disabled="!item.config.api.system.enable") 配置
		.d-manage-modal-control(v-if="apiType === '自定义URL'")
			label 接口地址
			.d-manage-modal-control-right
				i-input(v-model="item.config.api.url")
		.d-manage-modal-control(v-if="apiType === '自定义URL'")
			label
			.d-manage-modal-control-right
				i-select(
					v-model="item.config.api.method",
					:style="{ marginRight: '10px', width: '100px' }")
					i-option(value="GET") GET
					i-option(value="POST") POST
					i-option(value="PUT") PUT
					i-option(value="DELETE") DELETE
					i-option(value="PATCH") PATCH
				i-input(v-model="item.config.api.path", :style="{ width: '100px' }")
		.d-manage-modal-control(v-if="item.config.api.system.enable")
			label 接口地址
			.d-manage-modal-control-right
				i-input(v-model="item.config.api.system.interface")
		.d-manage-modal-control(v-if="item.config.api.system.enable")
			label
			.d-manage-modal-control-right
				i-select(
					v-model="item.config.api.system.method",
					:style="{ marginRight: '10px', width: '100px' }")
					i-option(value="GET") GET
					i-option(value="POST") POST
					i-option(value="PUT") PUT
					i-option(value="DELETE") DELETE
					i-option(value="PATCH") PATCH
				i-input(v-model="item.config.api.system.path", :style="{ width: '100px' }")
				database-config(
					ref="dataBaseConfig",
					:showModal="showDatabaseConfigModal",
					@close="showDatabaseConfigModal = false",
					@update="updateApiSystem",
					@keyup.native.stop)
		d-code(
			label="请求参数",
			lang="json",
			:code="typeof item.config.api.params === 'string' ? item.config.api.params : JSON.stringify(item.config.api.params)",
			@update:code="value => (item.config.api.params = JSON.parse(value))")
		// END_PROD
		d-code(
			label="响应数据",
			lang="json",
			:code="apiData",
			@update:code="value => (apiData = value)")
	// START_PROD
	d-right-swiper(title="数据处理")
		d-code(
			label="数据加工",
			:code="item.config.api.process.methodBody",
			:show="item.config.api.process.enable",
			@update:code="value => (item.config.api.process.methodBody = value)")
			template(slot="right")
				i-switch(v-model="item.config.api.process.enable")
		.d-manage-modal-control
			label 自动更新
			.d-manage-modal-control-right
				i-input-number(
					:min="1",
					:step="1",
					:formatter="value => `${value} ms`",
					v-model="item.config.api.autoFetch.duration",
					:style="{ marginRight: '10px' }",
					v-if="item.config.api.autoFetch.enable")
				i-switch(v-model="item.config.api.autoFetch.enable")
	// END_PROD
	d-right-swiper(title="事件")
		.d-manage-modal-control
			label 组件关联
			.d-manage-modal-control-right
				i-switch(v-model="item.config.api.bind.enable", style="margin-right: 10px")
				i-select(
					v-if="item.config.api.bind.enable",
					v-model="item.config.api.bind.refIds",
					filterable,
					multiple,
					:style="{ width: '100px' }")
					i-option(:value="item.id", v-for="(item, key) in relateList", :key="key") {{ item.id }}
		.d-manage-modal-control
			label 事件配置
			.d-manage-modal-control-right
				i-button(type="primary", @click="eventModal = true") 配置事件
		i-modal(v-model="eventModal", title="事件配置", :footer-hide="true")
			.d-manage-modal-control(
				v-for="(m, n) in item.config.event.component",
				:key="n",
				style="align-items: baseline")
				label 组件事件
				.d-manage-modal-control-right.d-data-modal-control-right.fn-flex.flex-column
					.fn-flex.fn-flex(:style="{ flex: 1, width: '100%' }")
						i-select(
							clearable,
							v-model="m.type",
							placeholder="事件类型",
							:style="{ marginRight: '10px' }")
							i-option(value="update") 更新组件
						i-select(v-model="m.ids", placeholder="选择组件", multiple, filterable)
							i-option(
								:value="k",
								:key="i",
								v-for="(k, i) in Object.keys(platform.widgetAdded)") {{ platform.widgetAdded[k].config.widget.name }}
					.fn-flex.fn-flex(:style="{ flex: 1, width: '100%' }")
						i-input(
							v-model="m.source",
							placeholder="源地址路径",
							@on-focus="event.inputFocus = true",
							@on-blur="event.inputFocus = false",
							:style="{ marginRight: '10px' }")
						i-select(clearable, v-model="m.target", placeholder="目标地址路径")
							i-option(value="config.api.params") 更新请求参数
							i-option(value="config.api.data") 更新响应数据
							i-option(value="config.config") 更新自定义数据
					d-code(
						:style="{ width: '100%' }",
						label="更新加工",
						:code="m.process.methodBody",
						:show="m.process.enable",
						@update:code="value => (m.process.methodBody = value)")
						template(slot="right")
							i-switch(v-model="m.process.enable")
					i-icon.pointer(
						type="ios-trash-outline",
						color="#fff",
						size="20",
						@click="delComponentEvent(n)")
			.add-scene(:style="{ marginBottom: '10px' }")
				i-button(@click="addComponentEvent", type="primary") 添加组件事件
			.d-manage-modal-control(
				v-for="(m, n) in item.config.event.scene",
				:key="n",
				style="align-items: baseline")
				label 场景事件
				.d-manage-modal-control-right.d-data-modal-control-right.fn-flex.flex-column(
					style="justify-content: space-between")
					.fn-flex.flex-row(:style="{ flex: 1, width: '100%' }")
						i-select(
							clearable,
							v-model="m.type",
							placeholder="事件类型",
							:style="{ marginRight: '10px' }")
							i-option(value="openScene") 打开场景
							i-option(value="closeScene") 关闭场景
							i-option(value="changeScene") 切换场景
						i-select(
							v-model="m.id",
							filterable,
							placeholder="目标场景",
							:style="{ marginRight: '10px' }")
							i-option(:value="0") 主场景
							i-option(:value="key", v-for="(item, key) in scene.obj", :key="key") {{ item.name }}
						i-select(
							clearable,
							filterable,
							placeholder="场景过度动画",
							v-model="m.animate")
							i-option(:value="k", v-for="(k, i) in animates", :key="i") {{ k }}
					i-icon.pointer(
						type="ios-trash-outline",
						color="#fff",
						size="20",
						@click="delSceneEvent(n)")
			.add-scene
				i-button(@click="addSceneEvent", type="primary") 添加场景事件
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import databaseConfig from '../components/data-warehouse/index.vue'
import dCode from '../components/d-code/index.vue'
import scene from '../store/scene.store'
import { animates } from './config.js'

@Component({ components: { databaseConfig, dCode } })
export default class FuncData extends func {
	animates = animates
	eventModal = false
	// START_PROD
	showDatabaseConfigModal = false

	get apiType() {
		if (this.item.config.api.system.enable) {
			return '数仓平台'
		} else if (this.item.config.api.url) {
			return '自定义URL'
		} else {
			return '无'
		}
	}

	set apiType(val) {
		if (val === '数仓平台') {
			this.item.config.api.system.enable = true
			this.item.config.api.url = ''
		} else if (val === '无') {
			this.item.config.api.url = ''
			this.item.config.api.system.enable = false
		} else {
			this.item.config.api.url = '/'
			this.item.config.api.system.enable = false
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
			} catch (e) {
				console.warn(e)
			}
		} else {
			data[prop] = ''
		}
	}

	get relateList() {
		const list = Object.values(this.platform.widgetAdded)
			.filter(
				(v: any) =>
					v.config.api.bind.enable && v.scene === scene.state.index,
			)
			.map((v: any) => {
				const { id, name } = v.config.widget
				return { id, name }
			})
		return list
	}

	// START_PROD
	updateApiSystem(value) {
		Object.assign(this.item.config.api.system.params, value)
		this.showDatabaseConfigModal = false
	}

	openSystemConfig() {
		const value = this.item.config
		if (!value) return
		this.showDatabaseConfigModal = true
		// @ts-ignore
		this.$refs.dataBaseConfig.setQueryCond(value.api.system.params)
	}
	// END_PROD

	addSceneEvent() {
		this.item.config.event.scene.push({
			id: '',
			type: '',
			animate: '',
		})
	}
	addComponentEvent() {
		this.item.config.event.component.push({
			ids: [],
			type: '',
			source: 'data',
			target: '',
			process: {
				enable: false,
				methodBody: '',
			},
		})
	}
	delComponentEvent(index) {
		this.item.config.event.component.splice(index, 1)
	}
	delSceneEvent(index) {
		this.item.config.event.scene.splice(index, 1)
	}
}
</script>
<style lang="scss" scoped>
.add-scene {
	padding-right: 10px;
	display: flex;
	justify-content: flex-end;
}
.d-data-modal-control-right {
	width: 400px;
	text-align: left;
	margin-right: 0;
}
</style>
