import scene from './src/store/scene.store'
import fetch from './fetch.js'
import dataProcess from './data-process.js'
import globalConfigValue from './common-config-value'
import platform from './src/store/platform.store'
import instance from './src/store/instance.store'
import { configMerge } from './src/utils'

const mx: any = {
	mixins: [fetch, dataProcess],
	inject: ['kanboardEditor'],
	props: {
		config: {
			type: Object,
			default: null,
		},
		readonly: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			configValue: null,
			ready: false,
			data: null,
			configReady: false,
			time: Date.now(),
			instance: null,
			animateTimer: null,
			animateActiveIndex: -1,
			output: null,
			inPreview: scene.state.status === 'inPreview',
		}
	},
	beforeDestroy() {
		this.instance = null
		clearInterval(this.animateTimer)
		clearTimeout(this.animateTimer)
		this.animateTimer = null
		this.animateActiveIndex = -1
	},
	methods: {
		/**
		 * @description 组件间联动，被关联组件收动添加 updateComponent 方法
		 */
		emitComponentUpdate(data) {
			if (this.configValue) {
				this.configValue.api.bind.refIds.forEach(ref => {
					let dom
					if (this.kanboardEditor.$refs[ref]) {
						dom = this.kanboardEditor.$refs[ref][0].$refs.widgets
					} else if (instance.actions.createKanboard?.$refs[ref]) {
						dom =
							instance.actions.createKanboard.$refs[ref][0].$refs
								.widgets
					}
					if (!dom) return
					if (typeof dom.updateComponent === 'function')
						dom.updateComponent(data)
					dom.updateAjax(data)
				})
			}
		},
		/**
		 * @description 组件间联动后的 ajax 数据重新请求
		 */
		updateAjax(data) {
			if (!this.config) {
				return
			}
			if (!this.config.api) {
				return
			}
			let params = this.config.api.params
			if (params) {
				if (typeof params === 'string') {
					params = { ...JSON.parse(params), ...data }
				} else {
					params = { ...params, ...data }
				}
			} else {
				params = data
			}
			this.config.api.params = params
		},
		/**
		 * @description
		 *
		 */
		parseConfigValue(
			localConfigValue = null,
			customConfig,
			useColorTheme = false,
		) {
			const mergedValue = localConfigValue
				? configMerge(
						localConfigValue,
						globalConfigValue(useColorTheme),
				  )
				: globalConfigValue(useColorTheme)
			const inputConfig = Object.freeze(this.config || {})
			const res = configMerge(inputConfig, mergedValue)
			// 过滤可用属性
			res.widget.name = res.widget.name || this.$parent.type
			if (customConfig) {
				customConfig.map(item => {
					if (!item.prop.includes('config.config')) {
						item.prop = `config.config.${item.prop}`
					}
				})
				res.customConfig = customConfig
			}
			if (this.config.widget) {
				platform.actions.updateConfig(this.config.widget.id, res)
			}
			this.$nextTick(() => {
				const payload = { value: { ...this.configValue } }
				this.configReady = true
				this.$emit('widget-config-update', payload)
			})
			return res
		},
	},
	computed: {
		styles() {
			const { layout } = this.config
			return {
				width: `${layout.size.width}${layout.size.unit}`,
				height: `${layout.size.height}${layout.size.unit}`,
				zIndex: `${layout.zIndex}`,
				transform: `translate3d(${layout.position.left}${layout.position.unit}, ${layout.position.top}${layout.position.unit},0)`,
			}
		},
		id() {
			const now = +new Date()
			if (this.config) {
				if (this.config.widget) {
					return `d-${
						this.config.widget.id ? this.config.widget.id : ''
					}${now}`
				}
				return `d-${now}`
			}
			return `d-${now}`
		},
	},
	watch: {
		configReady(value) {
			if (value) {
				requestAnimationFrame(() => {
					this.readonly && this.$el.classList.add('readonly')
					this.ready = true
				})
			}
		},
		'config.widget.locked'(value) {
			if (this.$el.style)
				this.$el.style.pointerEvents = value ? 'none' : null
		},
	},
}
export default mx
