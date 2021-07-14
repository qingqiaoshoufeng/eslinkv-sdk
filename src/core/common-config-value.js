import colorTheme from '@/core/colorTheme'

const commonConfigValue = (type = 'normal') => {
	const normal = {
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
		config: { colorTheme },
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
		widgetType: 'normal',
	}
	const echarts = {
		echartsGrid: {
			top: 60,
			left: '10%',
			right: '10%',
			bottom: 60,
			width: 'auto',
			height: 'auto',
			backgroundColor: 'transparent',
			borderColor: '#ccc',
			borderWidth: 1,
			show: false,
		},
		echartsSeries: [{ type: 'line' }],
		echartsYAxis: [
			{
				name: '萨达省',
				splitLine: {
					show: true,
					lineStyle: {
						type: 'solid',
						color: 'rgba(199, 209, 219, 0.2)',
					},
				},
				type: 'value',
				axisLabel: {
					color: '#fff',
					fontSize: 16,
					lineHeight: 16,
				},
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				nameTextStyle: {
					color: '#fff',
				},
				offset: 5,
			},
		],
		echartsXAxis: [
			{
				type: 'category',
				data: [],
				axisTick: {
					show: false,
				},
				axisLine: {
					show: false,
				},
				axisLabel: {
					color: '#fff',
					fontSize: 16,
					lineHeight: 16,
					interval: 0,
				},
				offset: 5,
			},
		],
		echartsXAnalysis: ['name'],
		echartsYAnalysis: ['value'],
	}
	let obj = {}
	switch (type) {
		case 'normal':
			obj = normal
			break
		case 'echarts':
			obj = { ...normal, ...echarts }
			break
		default:
			obj = normal
	}
	return obj
}

export default commonConfigValue
