import Editor from '@/core/Editor'
const editor: Editor = Editor.Instance()
import { databaseQuery } from '@/vue2/api/dataWarehouse.api.js'
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
			!isArray ? (output[key] = input[key]) : output.push(input[key])
		})
	return output
}

export default {
	data() {
		return {
			querying: false,
			queryFailed: false,
			queryTimer: null,
			fetchTimer: null,
			lastFetchDoneTime: null,
		}
	},
	methods: {
		outerQuery(api): void {
			const { url, method } = api
			if (!url) return
			const params = parseParams(api.params)
			editor.request(method, url, params, this.widgetId)
			// .finally(() => {
			// 	this.querying = false
			// 	this.lastFetchDoneTime = Date.now()
			// })
		},
		innerQuery(api): void {
			const { interface: innerUrl, params: conditions, path = 'data', method = 'POST' } = api.system
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
			this.querying = true
			this.queryFailed = false
			databaseQuery(params, method, innerUrl).then(response => {
				const process = api.process
				this.parseQueryResult(response, {
					path,
					process,
				})
				this.querying = false
				this.lastFetchDoneTime = Date.now()
			})
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
			if (this.queryTimer) clearTimeout(this.queryTimer)
			this.queryTimer = setTimeout(() => {
				this.dispatchQuery(api)
				this.queryTimer = null
			}, 400)
		},
		startAutoFetch(): void {
			this.stopAutoFetch()
			if (this.queryTimer) {
				this.fetchTimer = setTimeout(() => {
					this.startAutoFetch()
				}, 400)
				return
			}
			const api = this.config.api
			if (!api) return
			if (!this.lastFetchDoneTime) this.lastFetchDoneTime = Date.now()
			this.fetchTimer = setInterval(() => {
				if (this.querying) return
				if (Date.now() - this.lastFetchDoneTime >= api.autoFetch.duration) this.dispatchQuery(api)
			}, 100)
		},
		stopAutoFetch(): void {
			this.fetchTimer && clearInterval(this.fetchTimer)
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
		autoFetchApi() {
			const api = this.config.api
			return api && api.autoFetch && api.autoFetch.enable
		},
	},
	watch: {
		querying(value): void {
			this.$emit(value ? 'query-start' : 'query-end')
		},
		queryFailed(value): void {
			value && this.$emit('query-failed')
		},
		apiChangeWatcher: {
			handler: 'handleApiChange',
			immediate: true,
			deep: true,
		},
		'config.api.params': {
			handler: 'handleApiChange',
			deep: true,
		},
		autoFetchApi: {
			handler: function (value) {
				if (value) {
					this.startAutoFetch()
				} else {
					this.stopAutoFetch()
				}
			},
			immediate: true,
		},
	},
	beforeDestroy(): void {
		this.fetchTimer && clearTimeout(this.fetchTimer)
		this.queryTimer && clearTimeout(this.queryTimer)
	},
}
