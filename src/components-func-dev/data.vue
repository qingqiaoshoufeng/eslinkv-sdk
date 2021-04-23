<template lang="pug">
.d-manage-modal-control-data
	d-right-swiper(title="数据请求", :show="true")
		d-code(
			label="响应数据",
			lang="json",
			:code="apiData",
			@update:code="value => (apiData = value)")
	d-right-swiper(title="事件")
		.d-manage-modal-control
			label 组件关联
			.d-manage-modal-control-right
				i-switch(v-model="item.config.api.bind.enable")
		.d-manage-modal-control(v-if="item.config.api.bind.enable")
			checkbox-group(v-model="item.config.api.bind.refIds")
				checkbox(:label="k.id", v-for="(k, i) in relateList", :key="i") {{ k.name }}
		.d-manage-modal-control
			label 场景事件
			.d-manage-modal-control-right
				i-select(
					clearable,
					v-model="item.config.event.scene.type",
					:style="{ marginRight: '10px', width: '100px' }")
					i-option(value="openScene") 打开场景
					i-option(value="closeScene") 关闭场景
					i-option(value="changeScene") 切换场景
				i-select(
					v-model="item.config.event.scene.id",
					filterable,
					:style="{ width: '100px' }")
					i-option(:value="0") 主场景
					i-option(:value="key", v-for="(item, key) in scene.obj", :key="key") {{ item.name }}
		.d-manage-modal-control
			label 组件事件
			.d-manage-modal-control-right
				i-select(
					clearable,
					v-model="item.config.event.component.type",
					:style="{ marginRight: '10px', width: '100px' }")
					i-option(value="update") 更新组件
				i-select(
					v-model="item.config.event.component.ids",
					placeholder="选择组件",
					multiple,
					filterable,
					:style="{ width: '100px' }")
					i-option(
						:value="k",
						:key="i",
						v-for="(k, i) in Object.keys(platform.widgetAdded)") {{ platform.widgetAdded[k].config.widget.name }}
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import databaseConfig from '../components/data-warehouse/index.vue'
import dCode from '../components/d-code/index.vue'
import scene from '../store/scene.store'

@Component({ components: { databaseConfig, dCode } })
export default class FuncData extends func {
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
}
</script>
