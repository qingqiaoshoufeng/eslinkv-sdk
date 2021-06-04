import scene from './src/store/scene.store'
import fetch from './fetch.js'
import dataProcess from './data-process.js'
import globalConfigValue from './common-config-value'
import instance from './src/store/instance.store'
import { createSandbox } from './data-process'
import { configMerge, usePath } from './src/utils'
import Editor from '@/core/Editor'

const mx: any = {
	mixins: [fetch, dataProcess],
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
			scene: scene.state,
			configValue: null,
			ready: false,
			data: null,
			configReady: false,
			time: Date.now(),
			instance: null,
			animateTimer: null,
			animateActiveIndex: -1,
			output: null,
			inPreview: true,
			editor: Editor.Instance(),
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
		__handleClick__(val) {
			if (!this.configValue) return
			for (const item of this.configValue.event.scene) {
				const sceneId = item.id
				switch (item.type) {
					case 'openScene':
						scene.state.activeWidgetId = this.config.widget.id
						this.editor.openScene(sceneId)
						break
					case 'closeScene':
						this.editor.closeScene(sceneId)
						break
					case 'changeScene':
						this.editor.setSceneIndex(sceneId)
						break
					default:
				}
			}
			for (const item of this.configValue.event.component) {
				if (item.type === 'update') {
					const coms = Object.values(
						this.editor.screenWidgets,
					).filter((v: any) => item.ids.includes(v.id))
					let data = usePath(item.source.trim(), val)
					const { enable, methodBody } = item.process
					if (enable && methodBody.trim()) {
						try {
							const processor = createSandbox(methodBody)
							data = processor({ data })
							coms.forEach((v: any) => {
								instance.actions.updateComponentTarget(
									v.id,
									item.target,
									data,
								)
							})
						} catch (err) {
							console.warn('数据加工函数语法错误：', err.message)
							this.$Message.warning(
								'数据加工函数语法错误：' + err.message,
							)
						}
					} else {
						coms.forEach((v: any) => {
							instance.actions.updateComponentTarget(
								v.id,
								item.target,
								data,
							)
						})
					}
				}
			}
		},
		/**
		 * @description 组件间联动，被关联组件收动添加 updateComponent 方法
		 * [id]
		 */
		emitComponentUpdate(data) {
			if (this.configValue) {
				this.configValue.api.bind.refIds.forEach((ref: any) => {
					let dom = this.editor.screenWidgets[ref]
					if (!dom) return
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
				this.editor.updateWidgetConfig(this.config.widget.id, res)
			}
			this.configReady = true
			if (this.configValue) {
				const id = this.configValue.widget.id
				this.editor.screenWidgets[id].config = this.configValue
			}
			return res
		},
	},
	computed: {
		styles() {
			const { layout } = this.config
			return {
				width: `${layout.size.width}px`,
				height: `${layout.size.height}px`,
				zIndex: `${layout.zIndex}`,
				transform: `translate3d(${layout.position.left}px, ${
					layout.position.top
				}px,0) ${layout.scale ? 'scale(' + layout.scale + ')' : ''}`,
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
		isSceneActive() {
			if (!this.config) return false
			if (!this.config.event.scene.length) return false
			return (
				scene.state.activeWidgetId === this.config.widget.id &&
				this.config.event.scene.some(
					v => v.id === scene.state.activeSceneId,
				)
			)
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
	},
	mounted() {
		this.inPreview = this.editor.editorStatus === 'inPreview'
	},
}
export default mx
