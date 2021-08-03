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
			<select-query ref="selectQuery" @getQueryCond="getQueryCond" :lastQuery="lastQuery"></select-query>
		</div>
		<div slot="footer">
			<Button type="default" @click="exit">取消</Button>
			<Button type="primary" @click="ok">确定</Button>
		</div>
	</Modal>
</template>
<script>
import selectQuery from './selectQuery'
import { Modal, Tabs, TabPane, Button } from 'view-design'

export default {
	components: {
		selectQuery,
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
			queryCond: {},
			lastQuery: {},
			isVisible: false,
		}
	},
	methods: {
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
				chartQueryType: 0, // 0：选择查询；1：单表查询；2：自定义查询
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
