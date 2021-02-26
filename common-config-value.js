const commonConfigValue = () => Object.freeze({
	widget: {
		name: '',
		id: Date.now(),
		remark: '',
		componentVersion: '',
		locked: false,
		hide: false
	},
	layout: {
		size: {
			width: 300,
			height: 200,
			unit: 'px',
		},
		position: {
			value: 'absolute',
			unit: 'px',
			left: 0,
			top: 0,
			right: 0,
			bottom: 0
		},
		zIndex: 10
	},
	config: {},
	api: {
		url: '',
		method: 'GET',
		params: '',
		path: 'data',
		data: '',
		autoFetch: {
			enable: false,
			duration: 5000
		},
		check: {
			enable: true,
			key: 'status',
			value: 200,
			type: 'Number'
		},
		system: {
			enable: false,
			interface: 'api/impalaByQueryId',
			method: 'GET',
			path: 'data',
			params: {
				chartCondition: '',
				analyseCondition: '',
				chartQueryType: '',
				dataAnalyseId: '',
				databaseId: '',
				databaseType: '',
				databaseName: '',
				dataSourceId: '',
				dataType: '',
				executeSql: '',
				projectId: '',
				tableId: '',
				tableName: ''
			}
		},
		process: {
			enable: false,
			methodBody: ''
		},
		bind: {
			enable: false,
			refIds: []
		}
	},
	animation: {
		transitionEnable: true,
		enter: 'fadeIn',
		// leave: 'fadeOut',
		delay: 0,
		duration: 600
	}
})

export default commonConfigValue
