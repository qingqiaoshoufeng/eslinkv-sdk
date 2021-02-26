import Vue from 'vue'
const context = require.context('/', false, /\.(api.js)$/)
const apis = {}
context.keys().forEach(name => {
	let key = name.replace(/^\.\//, '').replace(/\.(api.js)$/, '')
	if (context(name).default) {
		apis[key] = context(name).default
	} else {
		apis[key] = context(name)
	}
})

Vue.prototype.$api = apis


// getKanboardConfig: data => http(data, 'post', prefix + '/board/detail'), // 分页查询项目列表
// databaseQuery: (params, method, url) => http(params, method, `${prefix}/${url}`),
// addBoard: (p, m) => http(p, m, prefix + '/board/save'), // 保存看板信息
// delBoard: (p, m) => http(p, m, prefix + '/board/delete'), // 看板删除
// editBoard: (p, m) => http(p, m, prefix + '/board/update'), // 修改看板信息
// getMaterials: data => http(data, 'post', prefix + '/material/page'),
// saveMaterials: data => http(data, 'post', prefix + '/material/batch/save'),
// deleteMaterial: data => http(data, 'post', prefix + '/material/delete'),
// publishBoard: data => http(data, 'post', prefix + '/board/publish'),
// getKanboardByHexCode: data => http(data, 'post', prefix + '/board/detail/hexCode'),
//
// 数仓相关接口
// getProList: (p, m) => http(p, m, prefix + '/project/list'), // 项目列表，不分页
// getAnalyseList: (p, m) => http(p, m, prefix + '/analyse/list'), // 查询以保存的分析列表
// getSourceList: (p, m) => http(p, m, prefix + '/source/list'), // 获取数据源列表
// getProDatabaseList: (p, m) => http(p, m, prefix + '/project/databaseList'), // 查询当前项目下的数据库列表
// getSourceDatabaseList: (p, m) => http(p, m, prefix + '/source/database/list'), // 获取数据源数据库列表
// getDatabaseTableList: (p, m) => http(p, m, prefix + '/database/tableList'), // 查询当前数据库下的数据表列表
// getTableDetail: (p, m) => http(p, m, prefix + '/table/detail'), // 数据表详情
// getSchemaList: (p, m) => http(p, m, prefix + '/source/schema/list'), // 获取schema列表
// getSourceTableList: (p, m) => http(p, m, prefix + '/source/table/list'), // 获取数据源数据表
// getSourceTableDetail: (p, m) => http(p, m, prefix + '/source/table/detail'), // 获取数据源表字段详情
