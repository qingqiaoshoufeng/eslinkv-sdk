<template>
	<!--todo: 移除es-form-new的依赖-->
	<Modal
		title="数仓参数配置"
		v-model="showModal"
		:height="height"
		:isDirectCloseModal="false"
		@on-cancel="exit"
		@on-visible-change="setVisibility"
	>
		<div class="modal-body">
			<Tabs
				v-if="isVisible"
				type="card"
				:animated="false"
				value="querySelect"
				@on-click="clickTabs"
				ref="tab"
			>
				<TabPane label="选择查询" name="querySelect">
					<select-query
						ref="selectQuery"
						@getQueryCond="getQueryCond"
						:lastQuery="lastQuery"
					></select-query>
				</TabPane>
				<TabPane label="单表查询" name="querySingle">
					<single-query
						ref="singleQuery"
						@getQueryCond="getQueryCond"
						:lastQuery="lastQuery"
					></single-query>
				</TabPane>
				<TabPane label="自定义查询" name="queryCustom">
					<custom-query
						v-if="chartType === 2"
						ref="customQuery"
						@getQueryCond="getQueryCond"
						:lastQuery="lastQuery"
					></custom-query>
				</TabPane>
			</Tabs>
		</div>
		<div slot="footer">
			<Button type="default" @click="exit">取消</Button>
			<Button type="primary" @click="ok">确定</Button>
		</div>
	</Modal>
</template>
<script>
import selectQuery from './selectQuery'
import singleQuery from './singleQuery'
import customQuery from './customQuery'
import { Modal, Tabs, TabPane, Button } from 'view-design'

export default {
	components: {
		selectQuery,
		singleQuery,
		customQuery,
		Modal,
		Tabs,
		TabPane,
		Button,
	},
	props: {
		// 弹窗状态
		showModal: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			height: '100%',
			chartType: 0, // 0：选择查询；1：单表查询；2：自定义查询
			queryCond: {},
			lastQuery: {},
			isVisible: false,
		}
	},
	methods: {
		// 选择查询模式
		clickTabs(name) {
			if (name === 'querySelect') this.chartType = 0
			else if (name === 'querySingle') this.chartType = 1
			else this.chartType = 2
		},
		getQueryCond(obj) {
			this.queryCond = obj
		},
		setQueryCond(obj) {
			this.lastQuery = obj
		},
		exit() {
			this.$emit('close')
		},
		ok() {
			this.$emit('update', {
				...this.queryCond,
				chartQueryType: this.chartType,
			})
		},
		setVisibility(status) {
			if (status) this.isVisible = true
			if (!status) {
				setTimeout(() => {
					this.isVisible = false
				}, 400)
			}
		},
	},
}
</script>
