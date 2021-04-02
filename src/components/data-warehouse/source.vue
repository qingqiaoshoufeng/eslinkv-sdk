<template>
	<Form
		:label-position="type == 1 ? 'left' : 'right'"
		:model="queryCond"
		:rules="queryRules"
		inline
		:label-width="70"
		style="width: 100%"
		ref="querySourceForm"
	>
		<FormItem
			:style="{ width: type == 1 ? '100%' : '' }"
			prop="dataSourceId"
			label="数据源"
			:label-width="80"
		>
			<i-select
				v-model="queryCond.dataSourceId"
				:style="{ width: type == 0 ? '140px' : '100%' }"
				@on-open-change="getProList"
				filterable
			>
				<i-option
					v-for="item in sourceList"
					:value="item.id"
					:key="item.id"
				>
					{{ item.name }}
				</i-option>
			</i-select>
		</FormItem>
		<FormItem
			:style="{ width: type == 1 ? '100%' : '' }"
			prop="databaseName"
			label="数据库名称"
			:label-width="90"
		>
			<i-select
				v-model="queryCond.databaseName"
				:style="{ width: type == 0 ? '140px' : '100%' }"
				filterable
			>
				<i-option
					v-for="item in databaseList"
					:value="item.value"
					:key="item.value"
				>
					{{ item.value }}
				</i-option>
			</i-select>
		</FormItem>
		<FormItem
			:style="{ width: type == 1 ? '100%' : '' }"
			v-if="databaseType == '1'"
			prop="databaseSchema"
			label="模式"
			:label-width="90"
		>
			<i-select
				v-model="queryCond.databaseSchema"
				:style="{ width: type == 0 ? '140px' : '100%' }"
				filterable
			>
				<i-option
					v-for="item in dataSchemaeList"
					:value="item.value"
					:key="item.value"
				>
					{{ item.value }}
				</i-option>
			</i-select>
		</FormItem>
		<FormItem
			:style="{ width: type == 1 ? '100%' : '' }"
			prop="tableName"
			label="表名称"
		>
			<i-select
				v-model="queryCond.tableName"
				:style="{ width: type == 0 ? '140px' : '100%' }"
				filterable
			>
				<i-option
					v-for="item in tableList"
					:value="item.value"
					:key="item.value"
				>
					{{ item.value }}
				</i-option>
			</i-select>
		</FormItem>
		<FormItem
			prop="analyseCondition"
			:label="index == 0 ? '条件' : ''"
			style="width: 100%"
			:label-width="type == 1 ? 40 : 70"
			v-for="(item, index) in queryCond.analyseCondition"
			v-show="item.index == 0 || queryCondShow"
			:key="index"
		>
			<Row
				:gutter="10"
				:style="index == 0 ? 'transform:translateX(-5px)' : ''"
			>
				<i-col :span="type == 0 ? 2 : 5">
					<i-select
						v-model="item.operator"
						v-if="index > 0"
						transfer
						filterable
					>
						<i-option
							v-for="item in querylogicList"
							:value="item.value"
							:key="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-col>
				<i-col :span="type == 0 ? 2 : 5">
					<i-select
						v-model="item.fieldName"
						clearable
						transfer
						@on-change="
							changeFieldName(null, item.fieldName, index)
						"
						filterable
					>
						<i-option
							v-for="item in queryFieldList"
							:value="item.value"
							:key="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-col>
				<i-col :span="type == 0 ? 2 : 4">
					<i-select v-model="item.fieldCond" transfer filterable>
						<i-option
							v-for="item in queryCondList"
							:value="item.value"
							:key="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-col>
				<i-col :span="type == 0 ? 2 : 6">
					<Input
						type="text"
						v-model="item.fieldValue"
						placeholder="请输入"
					/>
				</i-col>
				<i-col
					:span="type == 0 ? 2 : 6"
					v-if="item.fieldCond == 'between'"
				>
					<Input type="text" disabled value="and" />
				</i-col>
				<i-col
					:span="type == 0 ? 2 : 6"
					v-if="item.fieldCond == 'between'"
				>
					<Input
						type="text"
						v-model="betweenField"
						placeholder="请输入"
					/>
				</i-col>
				<i-col span="4">
					<Icon
						type="md-add-circle"
						@click="searchCondAdd"
						class="btn add"
					/>
					<Icon
						type="md-remove-circle"
						@click="searchCondRemove(index)"
						class="btn"
						v-show="queryCond.analyseCondition.length > 1"
					/>
				</i-col>
			</Row>
		</FormItem>
		<FormItem
			prop="limitNum"
			:class="{ chart: type == 1 }"
			label="条数限制"
			:label-width="64"
			v-if="type == 0"
		>
			<div style="display: flex">
				<Checkbox v-model="queryCond.isLimit"></Checkbox>
				<i-select v-model="queryCond.limitNum" v-if="queryCond.isLimit">
					<i-option
						v-for="item in queryCond.limitNumList"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</div>
		</FormItem>
	</Form>
</template>

<script>
import {
	Form,
	FormItem,
	Select,
	Option,
	Checkbox,
	Input,
	Col,
	Row,
	Icon,
} from 'view-design'

export default {
	components: {
		Form,
		FormItem,
		'i-select': Select,
		Option,
		Checkbox,
		'i-col': Col,
		Row,
		Input,
		Icon,
	},
	data() {
		return {
			sourceList: [],
			addIndex: 0,
			databaseType: '0',
			analyseCondition: null, // 回显保存条件
			queryCond: {
				databaseType: '0', // 1是ORACLE,0是Mysql
				dataSourceId: '',
				databaseName: '',
				databaseSchema: '',
				tableName: '',
				analyseCondition: [
					{
						fieldName: '',
						fieldCond: '=',
						fieldValue: '',
						index: 0,
					},
				],
				isLimit: 0,
				limitNum: null,
				limitNumList: [
					{
						value: 100,
						label: 100,
					},
					{
						value: 200,
						label: 200,
					},
					{
						value: 500,
						label: 500,
					},
					{
						value: 800,
						label: 800,
					},
					{
						value: 1000,
						label: 1000,
					},
				],
			},
			betweenField: '',
			queryStatus: false,
			databaseList: [], // 数据库列表
			tableList: [], // 表列表
			dataSchemaeList: [], // oracle下模式列表
			queryFieldList: [],
			querylogicList: [
				{
					value: 'and',
					label: 'and',
				},
				{
					value: 'or',
					label: 'or',
				},
			],
			queryCondList: [
				{
					value: '=',
					label: '=',
				},
				{
					value: '>',
					label: '>',
				},
				{
					value: '<',
					label: '<',
				},
				{
					value: '!=',
					label: '!=',
				},
				{
					value: '>=',
					label: '>=',
				},
				{
					value: '<=',
					label: '<=',
				},
				{
					value: 'like',
					label: 'like',
				},
				{
					value: 'in',
					label: 'in',
				},
				{
					value: 'between',
					label: 'between',
				},
			],
			queryRules: {
				dataSourceId: [{ required: true, message: '项目名不能为空' }],
				databaseName: [{ required: true, message: '数据库名不能为空' }],
				tableName: [{ required: true, message: '表名不能为空' }],
			},
			queryCondShow: false,
			isEcho: false, // 是否回显
			singleCond: null,
		}
	},
	props: ['type'],
	mounted() {
		this.getProList(true)
	},
	methods: {
		// 重置
		resetForm() {
			this.$refs.querySourceForm.resetFields()
			this.queryCond.analyseCondition = [
				{
					operator: 'and',
					fieldName: '',
					fieldCond: '=',
					fieldValue: '',
					index: 0,
				},
			]
			this.queryCond.databaseSchema = ''
			this.queryCond.isLimit = false
		},
		// 回显
		reShow(row, bool, singleCond, type) {
			// 数据源类型id
			this.queryCond.dataSourceId = row.dataSourceId
			this.queryCond.databaseName = row.databaseName
			this.queryCond.databaseSchema = row.databaseSchema
			this.queryCond.tableName = row.tableName
			this.queryCond.analyseCondition = row.analyseCondition
			this.analyseCondition = row.analyseCondition
			this.queryCond.isLimit = row.isLimit == 1
			this.queryCond.limitNum = row.limitNum
			// 数据库类型
			// this.queryCond.databaseType = row.databaseType
			this.isEcho = bool
			this.singleCond = singleCond
		},
		// 图表管理中的回显操作
		reShowChart(row) {
			this.queryCond.dataSourceId = row.dataSourceId
			if (row.analyseCondition) {
				this.queryCond.analyseCondition = row.analyseCondition
			} else {
				this.queryCond.analyseCondition = [
					{
						fieldName: '',
						fieldCond: '=',
						fieldValue: '',
						index: 0,
					},
				]
			}

			this.queryCond.databaseType = row.databaseType
			this.databaseType =
				row.databaseType == 'MYSQL' || row.databaseType == '' ? 0 : 1
			this.isEcho = true
			this.singleCond = {
				databaseName: row.databaseName,
				tableName: row.tableName,
				databaseSchema: row.databaseSchema,
			}
		},
		// 数据是否回显
		cEcho(e) {
			this.isEcho = e
		},
		// 添加条件filedType
		changeFieldName(data, val, index) {
			if (val) {
				this.queryFieldList.forEach(ele => {
					if (ele.value == val) {
						this.queryCond.analyseCondition[index].filedType =
							ele.fieldType
					}
				})
			}
		},
		getProList(bool) {
			this.isEcho = false
			if (bool) {
				this.$api.dataWarehouse.getSourceList().then(res => {
					this.sourceList = res
				})
			}
		},
		// 添加筛选条件
		searchCondAdd() {
			this.addIndex++
			this.queryCond.analyseCondition.push({
				operator: 'and',
				fieldName: '',
				fieldCond: '=',
				fieldValue: '',
				index: this.addIndex,
			})
		},
		// 移除筛选条件
		searchCondRemove(index) {
			if (this.queryCond.analyseCondition.length === 1) return
			this.queryCond.analyseCondition.splice(index, 1)
		},
	},
	watch: {
		// 获取数据库列表
		'queryCond.dataSourceId': {
			handler(value, oldValue) {
				if (value) {
					this.queryCond.databaseName = ''
					this.queryCond.tableName = ''
					this.databaseList = []
					this.tableList = []
					this.queryFieldList = []
					this.sourceList.forEach(val => {
						if (val.id == value) {
							this.databaseType = val.dataSourceType
							this.queryCond.databaseType = val.dataSourceType
						}
					})
					this.$api.dataWarehouse
						.getSourceDatabaseList({ id: value })
						.then(data => {
							const list = []
							if (data.length == 0) {
								this.$Message.info('当前项目下无库')
							} else {
								data.map((item, index) => {
									list.push({
										value: item,
									})
								})
							}
							this.databaseList = list
							// 回显设置
							if (this.isEcho)
								this.queryCond.databaseName = this.singleCond.databaseName
						})
				}
			},
		},
		// 获取表列表
		'queryCond.databaseName': {
			handler(value, oldValue) {
				if (value) {
					this.queryCond.tableName = ''
					this.tableList = []
					this.queryFieldList = []
					if (this.databaseType == 0) {
						this.$api.dataWarehouse
							.getSourceTableList({
								id: this.queryCond.dataSourceId,
								databaseName: value,
							})
							.then(data => {
								const list = []
								if (data.length == 0) {
									this.$Message.info('当前数据库为空')
								} else {
									data.map((item, i) => {
										list.push({
											value: item,
										})
									})
								}
								this.tableList = list
								// 回显设置
								if (this.isEcho)
									this.queryCond.tableName = this.singleCond.tableName
							})
					} else {
						this.queryCond.databaseSchema = ''
						this.$api.dataWarehouse
							.getSchemaList({
								id: this.queryCond.dataSourceId,
								databaseName: value,
							})
							.then(data => {
								this.dataSchemaeList = []
								const list = []
								if (data.length == 0) {
									this.$Message.info('当前数据库为空')
								} else {
									data.map((item, i) => {
										list.push({
											value: item,
										})
									})
								}
								this.dataSchemaeList = list
								// 回显设置
								if (this.isEcho)
									this.queryCond.databaseSchema = this.singleCond.databaseSchema
							})
					}
				}
			},
		},
		// oracle下获取表
		'queryCond.databaseSchema': {
			handler(value) {
				if (value && this.queryCond.databaseName) {
					this.queryCond.tableName = ''
					this.tableList = []
					this.queryFieldList = []
					this.$api.dataWarehouse
						.getSourceTableList({
							id: this.queryCond.dataSourceId,
							databaseName: this.queryCond.databaseName,
							databaseSchema: value,
						})
						.then(data => {
							const list = []
							if (data.length == 0) {
								this.$Message.info('当前数据库为空')
							} else {
								data.map((item, i) => {
									list.push({
										value: item,
									})
								})
							}
							this.tableList = list
							// 回显设置
							if (this.isEcho)
								this.queryCond.tableName = this.singleCond.tableName
						})
				}
			},
		},
		// 获取筛选条件列表
		'queryCond.tableName': {
			handler(value) {
				if (value) {
					this.queryCond.analyseCondition = [
						{
							fieldName: '',
							fieldCond: '=',
							fieldValue: '',
							index: 0,
						},
					]
					this.queryFieldList = []
					let data
					if (this.databaseType == 0) {
						data = {
							id: this.queryCond.dataSourceId,
							databaseName: this.queryCond.databaseName,
							tableName: value,
						}
					} else {
						data = {
							id: this.queryCond.dataSourceId,
							databaseName: this.queryCond.databaseName,
							tableName: value,
							databaseSchema: this.queryCond.databaseSchema,
						}
					}
					this.$api.dataWarehouse
						.getSourceTableDetail(data)
						.then(data => {
							const list = []
							data.map(item => {
								list.push({
									value: item.fieldName,
									label: item.fieldDesc
										? item.fieldDesc
										: item.fieldName,
									fieldType: item.fieldType,
								})
							})
							this.queryFieldList = list
							if (this.isEcho) {
								this.queryCond.analyseCondition = this.analyseCondition
								setTimeout(() => {
									this.isEcho = false
								})
							}
						})
				}
			},
		},
		'queryCond.analyseCondition': {
			handler(value) {
				if (value.length > 1) {
					this.queryCondShow = true
					this.$emit('listenAddCondShow', true)
				} else {
					this.$emit('listenAddCondShow', false)
				}
			},
		},
		// 单表查询的值emit出去
		queryCond: {
			deep: true,
			handler(obj) {
				if (this.type == 1) {
					const params = JSON.parse(JSON.stringify(obj))
					this.$set(params, 'dataType', 1)
					delete params.limitNum
					delete params.isLimit
					delete params.limitNumList
					this.$emit('setSource', params, 1)
				}
			},
		},
	},
}
</script>

<style scoped>
.chart {
	width: 100%;
}

.btn {
	font-size: 24px;
	color: #f54e40;
	cursor: pointer;
}

.btn.add {
	margin-left: 8px;
	color: #07bf54;
}
</style>
