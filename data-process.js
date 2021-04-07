// todo 移除/改造
const buildWall = source => {
	source = `with (wall) { ${source} }`
	// eslint-disable-next-line no-new-func
	return new Function('wall', source)
}

const createSandbox = source => {
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
		 * @description 按照引用路径，查找末端数据
		 */
		usePath(path, data) {
			const keys = path ? path.split('.') : []
			while (keys.length) {
				const key = keys.shift()
				if (!key) {
					this.$Message.warning(`数据源查找路径 ${path} 无效！`)
					break
				}
				data = data[key]
				if (data === undefined) {
					this.$Message.warning(
						`数据源查找路径 ${path}，在 ${key} 处未引用到有效数据！`,
					)
					break
				}
			}
			return data
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
			response = this.usePath(path, response)
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
