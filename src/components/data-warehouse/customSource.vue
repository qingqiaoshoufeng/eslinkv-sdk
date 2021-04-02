<template>
	<!--todo: 移除es-form-new的依赖-->
	<Form
		:model="queryCustomSource"
		:label-width="70"
		style="display: block; width: 100%"
		ref="queryCustomSource"
		:rules="querySourceRule"
	>
		<FormItem label="数据源" prop="dataSourceId" style="width: 100%">
			<Select
				v-model="queryCustomSource.dataSourceId"
				@on-open-change="openCustomPro"
				transfer
				filterable
			>
				<Option
					v-for="item in querySourceList.sourceList"
					:value="item.id"
					:key="item.id"
				>
					{{ item.name }}
				</Option>
			</Select>
		</FormItem>
		<FormItem label="数据库" prop="databaseName" style="width: 100%">
			<Select
				v-model="queryCustomSource.databaseName"
				transfer
				@on-open-change="openCustomDatabase"
				filterable
			>
				<Option
					v-for="v in querySourceList.databaseList"
					:value="v"
					:key="v"
				>
					{{ v }}
				</Option>
			</Select>
		</FormItem>
		<FormItem
			label="模式"
			prop="databaseSchema"
			style="width: 100%"
			v-if="databaseType == 1"
		>
			<Select
				v-model="queryCustomSource.databaseSchema"
				transfer
				@on-open-change="openBaseSchema"
				filterable
			>
				<Option
					v-for="v in querySourceList.databaseSchemaList"
					:value="v"
					:key="v"
				>
					{{ v }}
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
					v-model="queryCustomSource.executeSql"
					@blur="sqlBlur"
					class="es-sql-box"
				></es-sql>
			</div>
		</FormItem>
	</Form>
</template>

<script>
import { Form, FormItem, Select, Option } from 'view-design'
import esSql from '../esSql.vue'

export default {
	data() {
		return {
			queryCustomSource: {
				dataSourceId: '',
				databaseName: '',
				databaseSchema: '',
				executeSql: '',
			},
			databaseType: 0, // 0表示MYSQL，1表示ORACLE

			querySourceRule: {
				dataSourceId: [
					{
						required: true,
						message: '数据源不能为空',
					},
				],
				databaseName: [
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
			querySourceList: {
				sourceList: [],
				databaseList: [],
				databaseSchemaList: [],
			},
		}
	},
	methods: {
		// 修改选中项目清空值
		changeCustomPro() {
			this.querySourceList.sourceList = []
			this.querySourceList.databaseList = ''
		},
		openCustomPro(value) {
			if (value) {
				this.querySourceList.sourceList = []
				this.getProList()
			}
		},
		openCustomDatabase(value) {
			if (value) {
				this.querySourceList.databaseList = []
				this.getDatabaseList(this.queryCustomSource.dataSourceId)
			}
		},
		openBaseSchema() {
			this.$api.dataWarehouse
				.getSchemaList({
					id: this.queryCustomSource.dataSourceId,
					databaseName: this.queryCustomSource.databaseName,
				})
				.then(data => {
					this.dataSchemaeList = []
					const list = []
					if (data.length == 0) {
						this.$Message.info('当前数据库为空')
					} else {
						data.map((item, i) => {
							list.push(item)
						})
					}
					this.querySourceList.databaseSchemaList = list
				})
		},
		// 获取项目列表
		getProList() {
			this.querySourceList.projectList = []
			const that = this
			that.$api.dataWarehouse.getSourceList().then(data => {
				that.querySourceList.sourceList = data
			})
		},
		// 获取项目下的数据库列表
		getDatabaseList(id) {
			if (!id) {
				this.$Message.warning('请先选择项目')
				return
			}
			this.querySourceList.sourceList.forEach(val => {
				if (val.id == this.queryCustomSource.dataSourceId) {
					this.databaseType = val.dataSourceType
				}
			})
			this.$api.dataWarehouse
				.getSourceDatabaseList({
					id: this.queryCustomSource.dataSourceId,
				})
				.then(data => {
					if (data.length == 0) {
						this.$Message.info('当前项目下无库')
					}
					this.querySourceList.databaseList = data
				})
		},
		reShow(data) {
			this.getProList()
			this.queryCustomSource.dataSourceId = data.dataSourceId
			this.openCustomDatabase(data.dataSourceId)
			this.queryCustomSource.databaseName = data.databaseName
			this.queryCustomSource.executeSql = data.executeSql
			this.databaseType = data.databaseType == 'ORACLE' ? 1 : 0
			this.openBaseSchema()
			this.queryCustomSource.databaseSchema = data.databaseSchema
		},
		// 失去焦点还原
		sqlBlur(value) {
			this.queryCustomSource.executeSql = value
		},
	},
	components: {
		esSql,
		Form,
		FormItem,
		Select,
		Option,
	},
	watch: {
		// 查询条件提交出去
		queryCustomSource: {
			deep: true,
			handler(val) {
				const obj = JSON.parse(JSON.stringify(val))
				this.$set(obj, 'dataType', 1)
				this.$emit('setCustom', obj)
			},
		},
		'queryCustomSource.dataSourceId': {
			handler(val) {
				this.querySourceList.sourceList.forEach(ele => {
					if (val == ele.id) {
						this.databaseType = ele.dataSourceType
					}
				})
			},
		},
	},
}
</script>

<style lang="scss" scoped>
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
