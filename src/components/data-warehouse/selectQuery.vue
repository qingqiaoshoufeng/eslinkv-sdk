<template>
	<!-- 选择查询 -->
	<!--todo: 移除es-form-new的依赖-->
	<div class="select-query">
		<div class="ivu-form-item-required source">
			<label class="ivu-form-item-label">数据来源</label>
			<RadioGroup v-model="dataType">
				<Radio label="0"><span>数仓</span></Radio>
				<Radio label="1"><span>数据源</span></Radio>
			</RadioGroup>
		</div>
		<es-form-new
			v-if="dataType == 0"
			:data="selectObj"
			:model="selectObjModel"
			ref="select"
		></es-form-new>
		<select-source
			@getSource="getSource"
			ref="selectSource"
			v-else
		></select-source>
	</div>
</template>
<script>
import selectSource from './selectSource'
import { RadioGroup, Radio } from 'view-design'
import esFormNew from '../es-form-new'

export default {
	props: {
		lastQuery: {
			type: Object,
			default: function () {
				return {}
			},
		},
	},
	data() {
		return {
			dataType: '0',
			// 表单配置
			selectObj: {
				showMessage: true,
				autocomplete: 'on',
				columns: 1,
				templetDetailList: [
					{
						type: 2,
						name: '项目',
						enName: 'projectId',
						placeholder: '请选择',
						addEdit: true,
						modifyEdit: true,
						colspan: 1,
						dataSourceList: [],
						required: true,
						onOpenChange: value => {
							if (value) {
								this.selectObj.templetDetailList[0].dataSourceList = []
								this.getProList()
							}
						},
					},
					{
						type: 2,
						name: '查询名称',
						enName: 'dataAnalyseId',
						placeholder: '请选择',
						addEdit: true,
						modifyEdit: true,
						colspan: 1,
						dataSourceList: [],
						required: true,
						onOpenChange: value => {
							if (value) {
								this.selectObj.templetDetailList[1].dataSourceList = []
								this.getQueryName(this.selectObjModel.projectId)
							}
						},
					},
				],
			},
			chartType: 0,
			selectObjModel: {
				projectId: '',
				dataAnalyseId: '',
			},
		}
	},
	components: { selectSource, RadioGroup, Radio, esFormNew },
	methods: {
		// 获取查询项目列表
		getProList() {
			this.$api.dataWarehouse.getProList().then(data => {
				const list = []
				data.map(item => {
					list.push({
						value: item.id.toString(),
						label: item.name,
					})
				})
				this.selectObj.templetDetailList[0].dataSourceList = list
			})
		},
		// 获取查询名称列表
		getQueryName(projectId) {
			if (!projectId) {
				this.$Message.warning('请先选择项目')
				return
			}
			this.selectObj.templetDetailList[1].dataSourceList = []
			this.$api.dataWarehouse
				.getAnalyseList({ projectId: projectId })
				.then(data => {
					const arr = []
					if (data.length > 0) {
						data.map(item => {
							arr.push({
								value: item.id.toString(),
								label: item.name,
							})
						})
						this.selectObj.templetDetailList[1].dataSourceList = arr
					} else {
						this.$Message.info('该项目下无结果')
					}
				})
		},
		getSource(data) {
			this.$emit('getQueryCond', data)
		},
	},
	watch: {
		'selectObjModel.projectId': {
			handler(value) {
				if (value) {
					this.getQueryName(value)
				}
			},
		},
		selectObjModel: {
			deep: true,
			handler(obj) {
				this.$set(obj, 'dataType', 0)
				this.$emit('getQueryCond', obj)
			},
		},
		dataType: {
			deep: true,
			immediate: true,
			handler(type) {
				if (type === '0') {
					const { projectId, dataAnalyseId } = this.lastQuery
					this.getProList()
					this.selectObjModel.projectId = projectId
					this.selectObjModel.dataAnalyseId = dataAnalyseId
				} else {
					this.$nextTick(() => {
						this.$refs.selectSource.reShow(this.lastQuery)
					})
				}
			},
		},
	},
}
</script>
<style lang="scss" scoped>
.source {
	padding: 10px 0 10px 5px;

	label {
		margin-right: 8px;
	}
}

.select-query {
	width: 100%;
}
</style>
