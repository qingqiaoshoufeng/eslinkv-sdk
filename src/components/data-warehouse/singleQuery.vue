<template>
	<!--todo: 移除es-form-new的依赖-->
	<!-- 单表查询 -->
	<div class="single-query">
		<div class="ivu-form-item-required source">
			<label class="ivu-form-item-label">数据来源</label>
			<RadioGroup v-model="dataType">
				<Radio label="0"><span>数仓</span></Radio>
				<Radio label="1"><span>数据源</span></Radio>
			</RadioGroup>
		</div>
		<div v-if="dataType == 0">
			<Form
				:model="querySingle"
				:label-width="90"
				class="single-query-form"
				ref="querySingle"
				:rules="querySingleRules"
				label-position="left"
			>
				<FormItem label="项目" prop="projectId" :label-width="70">
					<i-select
						v-model="querySingle.projectId"
						@on-change="changeSinglePro"
						@on-open-change="openSinglePro"
						transfer
						filterable
					>
						<i-option
							v-for="v in querySingleList.projectList"
							:value="v.value"
							:key="v.value"
						>
							{{ v.label }}
						</i-option>
					</i-select>
				</FormItem>
				<FormItem label="查询名称" prop="projectId" :label-width="70">
					<i-select
						v-model="querySingle.projectId"
						@on-change="changeSinglePro"
						@on-open-change="openSinglePro"
						transfer
						filterable
					>
						<i-option
							v-for="v in querySingleList.projectList"
							:value="v.value"
							:key="v.value"
						>
							{{ v.label }}
						</i-option>
					</i-select>
				</FormItem>
				<FormItem label="数据库名称" prop="databaseId">
					<i-select
						v-model="querySingle.databaseId"
						@on-change="changeSingleDatabase"
						@on-open-change="openSingleDatabase"
						transfer
						filterable
					>
						<i-option
							v-for="v in querySingleList.databaseList"
							:value="v.value"
							:key="v.value"
						>
							{{ v.label }}
						</i-option>
					</i-select>
				</FormItem>
				<FormItem label="表名称" prop="tableId" :label-width="70">
					<i-select
						v-model="querySingle.tableId"
						@on-change="changeSingleTable"
						@on-open-change="openSingleTable"
						transfer
						filterable
					>
						<i-option
							v-for="v in querySingleList.tableList"
							:value="v.value"
							:key="v.value"
						>
							{{ v.label }}
						</i-option>
					</i-select>
				</FormItem>
				<FormItem
					:label="index > 0 ? '' : '条件'"
					:label-width="40"
					v-for="(item, index) in querySingle.cond.itemList"
					:key="index"
				>
					<Row
						:gutter="4"
						:style="index == 0 ? 'transform:translateX(-2px)' : ''"
					>
						<i-col
							:span="item.fieldCond == 'between' ? '4' : '6'"
							v-if="index > 0"
						>
							<i-select
								v-model="item.operator"
								transfer
								filterable
							>
								<i-option
									v-for="v in querySingleList.condList"
									:value="v.value"
									:key="v.value"
								>
									{{ v.label }}
								</i-option>
							</i-select>
						</i-col>
						<i-col :span="item.fieldCond == 'between' ? '3' : '5'">
							<i-select
								v-model="item.fieldName"
								transfer
								@on-change="
									changeFieldName(null, item.fieldName, index)
								"
								filterable
							>
								<i-option
									v-for="v in querySingleList.fieldList"
									:value="v.value"
									:key="v.value"
								>
									{{ v.label }}
								</i-option>
							</i-select>
						</i-col>
						<i-col :span="item.fieldCond == 'between' ? '4' : '6'">
							<i-select
								v-model="item.fieldCond"
								transfer
								filterable
							>
								<i-option
									v-for="v in querySingleList.fieldCond"
									:value="v.value"
									:key="v.value"
								>
									{{ v.label }}
								</i-option>
							</i-select>
						</i-col>
						<i-col :span="item.fieldCond == 'between' ? '3' : '4'">
							<Input type="text" v-model="item.fieldValue" />
						</i-col>
						<i-col span="4" v-if="item.fieldCond == 'between'">
							<Input type="text" disabled value="and" />
						</i-col>
						<i-col span="3" v-if="item.fieldCond == 'between'">
							<Input
								type="text"
								v-model="querySingleList.betweenField"
								placeholder="请输入"
							/>
						</i-col>
						<i-col span="2" style="display: flex">
							<Icon
								type="md-add-circle"
								@click="addSingleCond"
								class="btn add"
							/>
							<Icon
								type="md-remove-circle"
								@click="removeSingleCond(index)"
								class="btn"
								v-if="querySingle.cond.itemList.length > 1"
							/>
						</i-col>
					</Row>
				</FormItem>
			</Form>
		</div>
		<source-tag
			ref="getsource"
			@setSource="setSource"
			v-else
			:type="1"
		></source-tag>
	</div>
</template>
<script>
import sourceTag from './source'
import {
	RadioGroup,
	Radio,
	Input,
	Form,
	FormItem,
	Select,
	Col,
	Row,
	Option,
	Icon,
} from 'view-design'

export default {
	components: {
		sourceTag,
		RadioGroup,
		Radio,
		Input,
		Form,
		FormItem,
		'i-select': Select,
		'i-col': Col,
		Row,
		'i-option': Option,
		Icon,
	},
	props: {
		lastQuery: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			dataType: '0', // 数据来源:1数据源,0数仓
			chartType: 1, // 单表查询
			// 表单值
			querySingle: {
				projectId: '',
				databaseId: '',
				tableId: '',
				cond: {
					itemList: [
						{
							fieldName: '',
							fieldCond: '=',
							fieldValue: '',
							index: 0,
						},
					],
				},
			},
			// 表单下拉框候选值
			querySingleList: {
				projectList: [],
				databaseList: [],
				tableList: [],
				fieldList: [],
				betweenField: '',
				fieldCond: [
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
				condList: [
					{
						value: 'and',
						label: 'and',
					},
					{
						value: 'or',
						label: 'or',
					},
				],
			},
			// 表单规则
			querySingleRules: {
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
				tableId: [
					{
						required: true,
						message: '表不能为空',
					},
				],
			},
			queryCondIndex: 0,
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
				this.querySingleList.projectList = list
			})
		},
		// 获取当前项目下的数据库列表
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
				this.querySingleList.databaseList = list
			})
		},
		// 获取当前数据库下的数据表列表
		getTableList(id) {
			if (!id) {
				this.$Message.warning('请先选择数据库')
				return
			}
			this.$api.dataWarehouse
				.getDatabaseTableList({ id: id })
				.then(res => {
					const list = []
					const data = res.tableList
					if (data.length == 0) {
						this.$Message.info('当前数据库为空')
					} else {
						data.map((item, i) => {
							list.push({
								value: item.id,
								label: item.name,
							})
						})
					}
					this.querySingleList.tableList = list
				})
		},
		// 切换项目 清空之前的值
		changeSinglePro() {
			this.querySingleList.databaseList = []
			this.querySingleList.tableList = []
			this.querySingleList.fieldList = []
			this.querySingle.databaseId = ''
			this.querySingle.tableId = ''
		},
		// 展开下拉框 请求接口 获取最新的项目列表
		openSinglePro(value) {
			if (value) {
				this.querySingleList.projectList = []
				this.getProList()
			}
		},
		// 数据库
		changeSingleDatabase() {
			this.querySingleList.tableList = []
			this.querySingleList.fieldList = []
			this.querySingle.tableId = ''
		},
		openSingleDatabase(value) {
			if (value) {
				this.querySingleList.databaseList = []
				this.getDatabaseList(this.querySingle.projectId)
			}
		},
		// 添加条件filedType
		changeFieldName(data, val, index) {
			if (val) {
				this.querySingleList.fieldList.forEach(ele => {
					if (ele.value == val) {
						this.querySingle.cond.itemList[index].filedType =
							ele.fieldType
					}
				})
			}
		},
		// 数据表
		changeSingleTable() {
			this.querySingleList.fieldList = []
			this.querySingle.cond.itemList = [
				{
					fieldName: '',
					fieldCond: '=',
					fieldValue: '',
					index: 0,
				},
			]
		},
		openSingleTable(value) {
			if (value) {
				this.querySingleList.tableList = []
				this.getTableList(this.querySingle.databaseId)
			}
		},
		// 增加查询条件
		addSingleCond() {
			this.queryCondIndex++
			this.querySingle.cond.itemList.push({
				operator: 'and',
				fieldName: '',
				fieldCond: '=',
				fieldValue: '',
				index: this.queryCondIndex,
			})
		},
		// 移除条件
		removeSingleCond(index) {
			if (this.querySingle.cond.itemList.length === 1) return
			this.querySingle.cond.itemList.splice(index, 1)
		},
		setSource(obj, type) {
			this.$emit('getQueryCond', obj, type)
		},
	},
	watch: {
		'querySingle.projectId': {
			handler(value) {
				if (value) {
					this.getDatabaseList(value)
				}
			},
		},
		'querySingle.databaseId': {
			handler(value) {
				if (value) {
					this.getTableList(value)
				}
			},
		},
		'querySingle.tableId': {
			handler(value) {
				if (value) {
					this.$api.dataWarehouse
						.getTableDetail({ id: value })
						.then(res => {
							const list = []
							const data = JSON.parse(res.fieldSet)
							data.map(item => {
								list.push({
									value: item.fieldName,
									label: item.fieldName,
								})
							})
							this.querySingleList.fieldList = list
						})
				}
			},
		},
		// 单表查询的值emit出去
		querySingle: {
			deep: true,
			handler(obj) {
				const params = JSON.parse(JSON.stringify(obj))
				delete params.cond
				this.$set(
					params,
					'chartCondition',
					JSON.stringify(obj.cond.itemList),
				)
				this.$set(params, 'dataType', 0)
				this.$emit('getQueryCond', params, 0)
			},
		},
		dataType: {
			deep: true,
			immediate: true,
			handler(type) {
				if (type === '0') {
					const {
						projectId,
						databaseId,
						tableId,
						chartCondition,
					} = this.lastQuery
					this.getProList()
					this.querySingle.projectId = projectId
					this.querySingle.databaseId = databaseId
					this.querySingle.tableId = tableId
					this.querySingle.cond.itemList = chartCondition
						? JSON.parse(chartCondition)
						: null
				} else {
					this.$nextTick(() => {
						this.$refs.getsource.reShowChart(this.lastQuery)
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

.single-query {
	width: 100%;

	.btn {
		font-size: 20px;
		line-height: 30px;
		color: #f54e40;
		cursor: pointer;
	}

	.btn.add {
		color: #07bf54;
	}

	.single-query-form {
		display: block;
		width: 100%;
		max-height: 256px;
		padding-right: 10px;
		overflow-x: hidden;
		overflow-y: auto;
	}
}
</style>
