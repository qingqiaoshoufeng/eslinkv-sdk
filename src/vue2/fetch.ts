import Editor from '@/core/Editor'
const parseParams = (params = {}) => {
	if (typeof params === 'string' && params !== '') {
		try {
			return JSON.parse(params)
		} catch (e) {
			console.warn(e)
		}
	}
	return params
}

const filterFalsyKey = input => {
	if (!input) return
	const isArray = Array.isArray(input)
	const output = !isArray ? {} : []
	Object.keys(input)
		.filter(key => {
			const value = input[key]
			return value !== undefined && value !== null && value !== ''
		})
		.forEach(key => {
			// @ts-ignore
			!isArray ? (output[key] = input[key]) : output.push(input[key])
		})
	return output
}

export default {
	data() {
		return {
			editor: Editor.Instance(),
		}
	},
	methods: {
		outerQuery(api): void {
			const { url, method } = api
			if (!url) return
			// 解析 params
			const params = parseParams(api.params)
			this.editor.request(method, url, params, this.__widgetId__)
		},
		innerQuery(api): void {
			const { interface: innerUrl, params: conditions, method = 'POST' } = api.system
			if (!innerUrl) return
			// 解析 params
			let params = { ...parseParams(api.params) }
			if (typeof params === 'object') {
				Object.keys(params).forEach(key => {
					const value = params[key]
					params[key] = typeof value !== 'object' ? value : JSON.stringify(value)
				})
				Object.assign(params, filterFalsyKey(conditions))
			} else {
				params = filterFalsyKey(conditions)
			}
			if (!Object.keys(params).length) return
			params.queryId = params.dataAnalyseId
			params.params = JSON.stringify(params)
			this.editor.request(method, '/server/' + innerUrl, params, this.__widgetId__)
		},
		dispatchQuery(api): void {
			if (!api.system || !api.system.enable) {
				// 调用外部接口
				this.outerQuery(api)
				return
			}
			// 调用数仓接口
			this.innerQuery(api)
		},
		handleApiChange(): void {
			const api = this.config.api
			if (!api) return
			this.dispatchQuery(api)
		},
	},
	computed: {
		apiChangeWatcher() {
			const { url, params, method, path, process = {}, system = {} } = this.config.api || {}
			const { enable: processEnable, methodBody } = process
			const {
				enable: systemEnable,
				interface: innerUrl,
				path: innerPath,
				params: systemParams,
				method: innerMethod,
			} = system
			return {
				url,
				params,
				method,
				path,
				processEnable,
				methodBody,
				systemEnable,
				innerUrl,
				systemParams,
				innerPath,
				innerMethod,
			}
		},
	},
	watch: {
		apiChangeWatcher: {
			handler: 'handleApiChange',
			immediate: true,
			deep: true,
		},
		// 'config.api.params': {
		// 	handler: 'handleApiChange',
		// 	deep: true,
		// },
	},
}
