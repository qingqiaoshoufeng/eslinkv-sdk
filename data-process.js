const isObjectString = input => {
	if (typeof input !== 'string') return false
	input.trim()
	const length = input.length
	return input.indexOf('[') === 0 && input.lastIndexOf(']') === length - 1 || input.indexOf('{') === 0 && input.lastIndexOf('}') === length - 1
}
import createSandbox from './js-sandbox'
const isEqual = (left, right) => {
  if (left === right) return true
  const type = typeof left
  if (type !== typeof right) return false
  if (type === 'object') {
    return JSON.stringify(left) === JSON.stringify(right)
  }
  return false
}

export default {
  data () {
    return {
      pathExecuteTimer: null
    }
  },
  methods: {
    updateApiData (value) {
      if (!this.config || !this.config.api) return
      const api = this.config.api
      if (this.isDataEqual()) return
      if (typeof value === 'object') {
        api.data = JSON.stringify(value)
        return
      }
      api.data = value
    },
    updateInnerData (value) {
      if (this.isDataEqual()) return
      if (isObjectString(value)) {
        try {
          this.data = JSON.parse(value)
        } catch (e) {
          console.warn(e)
          this.data = value
        }
        return
      }
      this.data = value
    },
    // 按照引用路径，查找末端数据
    usePath (path, data) {
      const keys = path ? path.split('.') : []
      while (keys.length) {
        const key = keys.shift()
        this.pathExecuteTimer && clearTimeout(this.pathExecuteTimer)
        if (!key) {
          this.pathExecuteTimer = setTimeout(() => {
            this.$Message.warning(`数据源查找路径 ${path} 无效！`)
            this.pathExecuteTimer = null
          }, 500)
          break
        }
        data = data[key]
        if (data == undefined) {
          this.pathExecuteTimer = setTimeout(() => {
            this.$Message.warning(`数据源查找路径 ${path}，在 ${key} 处未引用到有效数据！`)
            this.pathExecuteTimer = null
          }, 500)
          break
        }
      }
      return data
    },
    // 数据加工
    useProcess (process = {}, data) {
      const { enable, methodBody } = process
      if (enable && methodBody.trim()) {
        try {
          const processor = createSandbox(methodBody, { refused: ['document', 'navigator'] })
          data = processor({ data })
        } catch (err) {
          console.warn('数据加工函数语法错误：', err.message)
          this.$Message.warning('数据加工函数语法错误：' + err.message)
        }
      }
      return data
    },
    parseQueryResult (response, { path, process }) {
      response = this.usePath(path, response)
      response = this.useProcess(process, response)
      this.data = response
    },
    isDataEqual () {
      if (!this.config.api) return false
      const apiData = this.config.api.data
      return isEqual(apiData, this.data)
    }
  },
  watch: {
    'config.api.data': {
      handler: function (newVal, oldVal) {
        if (newVal === undefined) return
        this.updateInnerData(newVal)
      },
      immediate: true,
      deep: true
    },
    data (value) {
      this.updateApiData(value)
    }
  }
}
