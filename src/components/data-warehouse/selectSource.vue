<template>
	<!--todo: 移除es-form-new的依赖-->
	<div>
		<es-form-new
			:data="selectObj"
			:model="selectObjModel"
			ref="select"
		></es-form-new>
	</div>
</template>

<script>
import esFormNew from '../es-form-new'

export default {
	components: {
		esFormNew,
	},
	data() {
		return {
			// 表单配置
			selectObj: {
				showMessage: true,
				autocomplete: 'on',
				columns: 1,
				templetDetailList: [
					{
						type: 2,
						name: '数据源',
						enName: 'dataSourceId',
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
								this.getQueryName(
									this.selectObjModel.dataSourceId,
								)
							}
						},
					},
				],
			},
			chartType: 0,
			selectObjModel: {
				dataSourceId: '',
				dataAnalyseId: '',
			},
		}
	},
	methods: {
		// 获取项目列表
		getProList() {
			this.$api.dataWarehouse.getSourceList().then(data => {
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
		getQueryName(dataSourceId) {
			if (!dataSourceId) {
				this.$Message.warning('请先选择项目')
				return
			}
			this.selectObj.templetDetailList[1].dataSourceList = []
			this.$api.dataWarehouse
				.getAnalyseList({ dataSourceId: dataSourceId })
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
		reShow(data) {
			this.getProList()
			this.selectObjModel.dataSourceId = data.dataSourceId.toString()
			this.selectObjModel.dataAnalyseId = data.dataAnalyseId.toString()
		},
	},
	watch: {
		'selectObjModel.dataSourceId': {
			handler(value) {
				if (value) {
					this.getQueryName(value)
				}
			},
		},
		selectObjModel: {
			deep: true,
			handler(obj) {
				this.$set(obj, 'dataType', 1)
				this.$emit('getSource', obj)
			},
		},
	},
}
</script>
