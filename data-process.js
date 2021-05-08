import { usePath } from './src/utils'
const buildWall = source => {
	source = `with (wall) { ${source} }`
	// eslint-disable-next-line no-new-func
	return new Function('wall', source)
}

export const createSandbox = source => {
	return function () {
		return buildWall(source).call({ ...arguments[0] }, { ...arguments[0] })
	}
}
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
			try {
				this.data = JSON.parse(value)
			} catch (e) {
				console.warn(e)
				this.data = value
			}
		},
		/**
		 * @description 数据加工
		 */
		useProcess(process = {}, data) {
			const { enable, methodBody } = process
			if (enable && methodBody.trim()) {
				try {
					const processor = createSandbox(methodBody)
					data = processor({ data })
				} catch (err) {
					console.warn('数据加工函数语法错误：', err.message)
					this.$Message.warning(
						'数据加工函数语法错误：' + err.message,
					)
				}
			}
			return data
		},
		parseQueryResult(response, { path, process }) {
			if (!response.data || typeof response.data !== 'object') {
				return
			}
			response = usePath(path, response)
			response = this.useProcess(process, response)
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
