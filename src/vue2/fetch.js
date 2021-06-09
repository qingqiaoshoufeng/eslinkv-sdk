import axios from 'axios'
import { databaseQuery } from '@/vue2/api/dataWarehouse.api'
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

const fetcher = axios.create({
	withCredentials: false,
})

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
		outerQuery(api) {
			const { url, method } = api
			if (!url) return
			this.querying = true
			this.queryFailed = false
			// 解析 params
			const params = parseParams(api.params)
			fetcher({
				method,
				url,
				[method.toUpperCase() === 'GET' ? 'params' : 'data']: params,
			})
				.then(response => {
					this.parseQueryResult(response, api)
				})
				.catch(e => {
					console.warn(`${this.$options.label}接口请求失败`, e)
					this.queryFailed = true
				})
				.finally(() => {
					this.querying = false
					this.lastFetchDoneTime = Date.now()
				})
		},
		innerQuery(api) {
			let {
				interface: innerUrl,
				params: conditions,
				path = 'data',
				method = 'POST',
			} = api.system
			if (!innerUrl) return
			// 解析 params
			let params = { ...parseParams(api.params) }
			if (typeof params === 'object') {
				Object.keys(params).forEach(key => {
					const value = params[key]
					params[key] =
						typeof value !== 'object'
							? value
							: JSON.stringify(value)
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
		dispatchQuery(api) {
			const system = api.system
			if (!system || !system.enable) {
				// 调用外部接口
				this.outerQuery(api)
				return
			}
			// 调用数仓接口
			this.innerQuery(api)
		},
		handleApiChange() {
			const api = this.config.api
			if (!api) return
			if (this.queryTimer) clearTimeout(this.queryTimer)
			this.queryTimer = setTimeout(() => {
				this.dispatchQuery(api)
				this.queryTimer = null
			}, 400)
		},
		startAutoFetch() {
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
				if (
					Date.now() - this.lastFetchDoneTime >=
					api.autoFetch.duration
				)
					this.dispatchQuery(api)
			}, 100)
		},
		stopAutoFetch() {
			this.fetchTimer && clearInterval(this.fetchTimer)
		},
	},
	computed: {
		apiChangeWatcher() {
			const { url, params, method, path, process = {}, system = {} } =
				this.config.api || {}
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
		querying(value) {
			this.$emit(value ? 'query-start' : 'query-end')
		},
		queryFailed(value) {
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
	beforeDestroy() {
		this.fetchTimer && clearTimeout(this.fetchTimer)
		this.queryTimer && clearTimeout(this.queryTimer)
	},
}
