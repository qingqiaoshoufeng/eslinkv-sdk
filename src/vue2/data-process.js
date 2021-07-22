import { usePath, useProcess } from '@/vue2/utils'

export default {
	data() {
		return {
			pathExecuteTimer: null,
		}
	},
	methods: {
		updateApiData(value) {
			if (!this.config || !this.config.api) return
			const api = this.config.api
			if (typeof value === 'object') {
				api.data = JSON.stringify(value)
				return
			}
			api.data = value
		},
		updateInnerData(value) {
			if (value !== '') {
				try {
					this.data = JSON.parse(value)
				} catch (e) {
					console.warn(e)
					this.data = value
				}
			}
		},
		parseQueryResult(response, { path, process }) {
			if (!response.data || typeof response.data !== 'object') {
				return
			}
			response = usePath(path, response)
			response = useProcess(process, response)
			this.data = response
		},
	},
	watch: {
		'config.api.data': {
			handler(newVal) {
				if (newVal === undefined) return
				this.updateInnerData(newVal)
			},
			immediate: true,
			deep: true,
		},
		data(value) {
			this.updateApiData(value)
		},
	},
}
