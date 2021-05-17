import { colorTheme } from './packages/config.default.js'

const commonConfigValue = useColorTheme =>
	Object.freeze({
		widget: {
			name: '',
			id: Date.now(),
			remark: '',
			componentVersion: '',
			locked: false,
			hide: false,
		},
		layout: {
			size: {
				width: 300,
				height: 200,
			},
			position: {
				value: 'absolute',
				left: 0,
				top: 0,
			},
			zIndex: 10,
			scale: 1,
		},
		config: useColorTheme ? { colorTheme } : {},
		api: {
			url: '',
			method: 'GET',
			params: '',
			path: 'data',
			data: '',
			autoFetch: {
				enable: false,
				duration: 5000,
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
					tableName: '',
				},
			},
			process: {
				enable: false,
				methodBody: '',
			},
			bind: {
				enable: false,
				refIds: [],
			},
		},
		animation: {
			transitionEnable: true,
			enter: 'fadeIn',
			delay: 0,
			duration: 600,
		},
		event: {
			scene: [
				// {
				// 	id: '',
				// 	type: '',
				// 	animate: '',
				// }
			],
			component: [
				// { ids: [], type: '', source:'', target:'' }
			],
		},
	})

export default commonConfigValue
