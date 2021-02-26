import axios from 'axios'
import jsonic from 'jsonic'

const parseParams = (params = {}) => {
	if (typeof params === 'string') {
		try {
			return jsonic(params.trim())
		} catch (e) { }
	}
	return params
}

const fetcher = axios.create({
	withCredentials: false
})

const filterFalsyKey = input => {
	if (!input) return
	const isArray = Array.isArray(input)
	const output = !isArray ? {} : []
	Object.keys(input).filter(key => {
		const value = input[key]
		return value !== undefined && value !== null && value !== ''
	}).forEach(key => {
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
			lastFetchDoneTime: null
		}
	},
	methods: {
		handleResponse(response, {path, check, process, url}) {
			// if (response?.data?.returnCode !== '0000') return
			if (check && check.enable) {
				const {key = 'code', value = 0, type = 'Number'} = check
				let checkValue = value
				if (type === 'Number') checkValue = value - 0
				// if (type === 'Boolean' && response[key] || response[key] === checkValue) {
				this.parseQueryResult(response, {path, process})
				// } else {
				// 	console.warn(`${this.config.widget.name || this.$options.label}数据检查失败\n接口: ${url}\n规则：${JSON.stringify({
				// 		key,
				// 		value,
				// 		type
				// 	})}`)
				// 	this.queryFailed = true
				// }
			} else {
				this.parseQueryResult(response, {path, process})
			}
		},
		outerQuery(api) {
			const {url, method} = api
			if (!url) return
			this.querying = true
			this.queryFailed = false
			// 解析 params
			const params = parseParams(api.params)
			fetcher({
				method,
				url,
				[method.toUpperCase() === 'GET' ? 'params' : 'data']: params
			}).then(response => {
				this.handleResponse(response, api)
			}).catch(e => {
				console.warn(`${this.$options.label}接口请求失败`, e)
				this.queryFailed = true
			}).finally(() => {
				this.querying = false
				this.lastFetchDoneTime = Date.now()
			})
		},
		innerQuery(api) {
			let {interface: innerUrl, params: conditions, path, check, method} = api.system
			if (!innerUrl) return

			// 解析 params
			let params = {...parseParams(api.params)}

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

			if (!path) path = 'data'
			if (!check) check = {
				enable: true,
				key: 'responseCode',
				value: '100000',
				type: 'String'
			}
			if (!method) method = 'POST'
			this.$api.dataWarehouse.databaseQuery(params, method, innerUrl).then(response => {
				const process = api.process
				this.handleResponse(response, {path, check, process, url: innerUrl})
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
				if (Date.now() - this.lastFetchDoneTime >= api.autoFetch.duration) this.dispatchQuery(api)
			}, 100)
		},
		stopAutoFetch() {
			this.fetchTimer && clearInterval(this.fetchTimer)
		}
	},
	computed: {
		apiChangeWatcher() {
			const {url, params, method, path, check = {}, process = {}, system = {}} = this.config.api || {}
			const {enable: checkEnable, key, value, type} = check
			const {enable: processEnable, methodBody} = process
			const {enable: systemEnable, interface: innerUrl, path: innerPath, check: innerCheck = {}, params: systemParams, method: innerMethod} = system
			const {enable: innerCheckEnable, key: innerCheckKey, value: innerCheckValue, type: innerCheckType} = innerCheck
			return {
				url, params, method, path,
				checkEnable, key, value, type,
				processEnable, methodBody,
				systemEnable, innerUrl, systemParams,
				innerPath, innerMethod, innerCheckEnable,
				innerCheckKey, innerCheckValue, innerCheckType
			}
		},
		autoFetchApi() {
			const api = this.config.api
			return api && api.autoFetch && api.autoFetch.enable
		}
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
			deep: true
		},
		autoFetchApi: {
			handler: function (value) {
				if (value) {
					this.startAutoFetch()
				} else {
					this.stopAutoFetch()
				}
			},
			immediate: true
		}
	},
	beforeDestroy() {
		this.fetchTimer && clearTimeout(this.fetchTimer)
		this.queryTimer && clearTimeout(this.queryTimer)
	}
}
