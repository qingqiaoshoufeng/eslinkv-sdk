<template>
	<!-- 自定义分析 -->
	<!--todo: 移除es-form-new的依赖-->
	<div class="custom-query">
		<div class="ivu-form-item-required source">
			<label class="ivu-form-item-label">数据来源</label>
			<RadioGroup v-model="dataType">
				<Radio label="0"><span>数仓</span></Radio>
				<Radio label="1"><span>数据源</span></Radio>
			</RadioGroup>
		</div>
		<Form
			v-if="dataType == 0"
			:model="queryCustom"
			:label-width="70"
			style="display: block; width: 100%"
			ref="queryCustom"
			:rules="queryCustomRule"
		>
			<FormItem label="项目" prop="projectId" style="width: 100%">
				<Select
					v-model="queryCustom.projectId"
					transfer
					filterable
					@on-open-change="openCustomPro"
					@on-change="changeCustomPro"
				>
					<Option
						v-for="v in queryCustomList.projectList"
						:value="v.value"
						:key="v.value"
					>
						{{ v.label }}
					</Option>
				</Select>
			</FormItem>
			<FormItem label="数据库" prop="databaseId" style="width: 100%">
				<Select
					v-model="queryCustom.databaseId"
					transfer
					filterable
					@on-open-change="openCustomDatabase"
				>
					<Option
						v-for="v in queryCustomList.databaseList"
						:value="v.value"
						:key="v.value"
					>
						{{ v.label }}
					</Option>
				</Select>
			</FormItem>
			<FormItem
				class="editor"
				label
				:label-width="0"
				style="height: 160px"
				prop="executeSql"
			>
				<!-- sql编辑器 -->
				<div class="es-sql-editor">
					<es-sql
						sqlName="custom-query"
						v-model="queryCustom.executeSql"
						class="es-sql-box"
					></es-sql>
				</div>
			</FormItem>
		</Form>
		<custom-source
			ref="customSource"
			@setCustom="setCustom"
			v-else
		></custom-source>
	</div>
</template>
<script>
import esSql from '../esSql.vue'
import customSource from './customSource'
import { RadioGroup, Radio, Select, Option, FormItem, Form } from 'view-design'

export default {
	props: {
		lastQuery: {
			type: Object,
			default: function () {
				return {}
			},
		},
	},
	components: {
		esSql,
		customSource,
		RadioGroup,
		Radio,
		Select,
		Option,
		FormItem,
		Form,
	},
	data() {
		return {
			databaseType: '',
			dataType: '0', // 数据源
			sqlName: 'sqlChart', // sql编辑器默认name
			sqlInitWidth: '', // sql编辑器宽度
			chartType: 2, // 自定义查询
			queryCustom: {
				projectId: '',
				databaseId: '',
				executeSql: '',
			},

			// 下拉框候选值
			queryCustomList: {
				projectList: [],
				databaseList: [],
			},
			// 表单规则
			queryCustomRule: {
				projectId: [
					{
						required: true,
						message: '项目不能为空',
					},
				],
				databaseId: [
					{
						required: true,
						message: '数据库不能为空',
					},
				],
				executeSql: [
					{
						required: true,
						message: 'SQL不能为空',
					},
				],
			},
		}
	},
	methods: {
		// 获取项目列表
		getProList() {
			this.$api.dataWarehouse.getProList().then(data => {
				const list = []
				data.map(item => {
					list.push({
						value: item.id,
						label: item.name,
					})
				})
				this.queryCustomList.projectList = list
			})
		},

		// 获取项目下的数据库列表
		getDatabaseList(id) {
			if (!id) {
				this.$Message.warning('请先选择项目')
				return
			}
			this.$api.dataWarehouse.getProDatabaseList({ id: id }).then(res => {
				const list = []
				const data = res.databaseList
				if (data.length == 0) {
					this.$Message.info('当前项目下无库')
				} else {
					data.map((item, index) => {
						list.push({
							value: item.id,
							label: item.name,
						})
					})
				}
				this.queryCustomList.databaseList = list
			})
		},
		// 修改选中项目清空值
		changeCustomPro() {
			this.queryCustomList.databaseList = []
			this.queryCustom.databaseId = ''
		},
		openCustomPro(value) {
			if (value) {
				this.queryCustomList.projectList = []
				this.getProList()
			}
		},
		openCustomDatabase(value) {
			if (value) {
				this.queryCustomList.databaseList = []
				this.getDatabaseList(this.queryCustom.projectId)
			}
		},
		setCustom(obj) {
			this.$emit('getQueryCond', obj)
		},
	},
	watch: {
		// 查询条件提交出去
		queryCustom: {
			deep: true,
			handler(val) {
				const obj = JSON.parse(JSON.stringify(val))
				this.$set(obj, 'dataType', 0)
				this.$emit('getQueryCond', obj)
			},
		},
		dataType: {
			deep: true,
			immediate: true,
			handler(type) {
				if (type === '0') {
					const { projectId, databaseId, executeSql } = this.lastQuery
					this.getProList()
					this.queryCustom.projectId = projectId
					this.openCustomDatabase(projectId)
					this.queryCustom.databaseId = databaseId
					this.queryCustom.executeSql = executeSql
				} else {
					this.$nextTick(() => {
						this.$refs.customSource.reShow(this.lastQuery)
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

.custom-query {
	width: 100%;

	.es-sql-editor {
		position: relative;
		z-index: 99;
		width: 100%;
		height: 160px;
	}
}
</style>
<style lang="scss">
.es-sql-box {
	width: 100%;
	height: 100%;

	.CodeMirror {
		width: 100%;
		height: 100%;
		font-size: 12px;
		border: 1px solid #f2f2f2;
	}
}
</style>
