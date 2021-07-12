import fetch from '@/vue2/fetch.js'
import dataProcess from '@/vue2/data-process.js'
import { createSandbox } from '@/vue2/data-process'
import { usePath } from '@/vue2/utils'
import Editor from '@/core/Editor'

const mx: any = {
	mixins: [fetch, dataProcess],
	props: {
		settingData: {
			type: Object,
		},
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
		eventTypeSetting(eventType) {
			this.editor.eventTypeSetting(this.config.widget.id, eventType)
		},
		dataSetting(list = [], data) {
			this.editor.dataSetting(this.config.widget.id, list, data)
		},
		__handleEvent__(val, eventType = 'click') {
			if (!this.config) return
			for (const item of this.config.event.scene) {
				const sceneId = item.id
				if (item.eventType === eventType || (!item.eventType && eventType === 'click'))
					switch (item.type) {
						case 'openScene':
							if (this.editor.current.currentCreateSceneList.includes(sceneId)) return
							this.editor.activeWidgetId = this.config.widget.id
							this.editor.current.sceneAnimate = item.animate || 'fadeIn'
							this.editor.openScene(sceneId)
							break
						case 'closeScene':
							this.editor.current.sceneAnimate = item.animate || 'fadeOut'
							this.editor.closeScene(sceneId)
							break
						case 'changeScene':
							this.editor.selectSceneIndex(sceneId)
							break
						default:
					}
			}
			for (const item of this.config.event.component) {
				if (item.type === 'update') {
					const coms = Object.values(this.editor.screenWidgets).filter((v: any) => item.ids.includes(v.id))
					let data = usePath(item.source.trim(), val)
					const { enable, methodBody } = item.process
					if (enable && methodBody.trim()) {
						try {
							const processor = createSandbox(methodBody)
							data = processor({ data })
							coms.forEach((v: any) => {
								if (item.eventType === eventType || (!item.eventType && eventType === 'click'))
									this.editor.updateComponentTarget(v.id, item.target, data)
							})
						} catch (err) {
							console.warn('数据加工函数语法错误：', err.message)
							this.$Message.warning('数据加工函数语法错误：' + err.message)
						}
					} else {
						coms.forEach((v: any) => {
							if (item.eventType === eventType || (!item.eventType && eventType === 'click'))
								this.editor.updateComponentTarget(v.id, item.target, data)
						})
					}
				}
			}
		},
		__handleClick__(val) {
			this.__handleEvent__(val, 'click')
		},
		/**
		 * @description 组件间联动，被关联组件收动添加 updateComponent 方法
		 * [id]
		 */
		emitComponentUpdate(data) {
			if (this.config) {
				this.config.api.bind.refIds.forEach((ref: any) => {
					const widget = this.editor.screenWidgets[ref]
					if (!widget) return
					let params = widget.config.api.params
					if (params) {
						if (typeof params === 'string') {
							params = { ...JSON.parse(params), ...data }
						} else {
							params = { ...params, ...data }
						}
					} else {
						params = data
					}
					widget.config.api.params = params
				})
			}
		},
		parseConfigValue(localConfigValue, customConfig) {
			this.configReady = true
			return this.editor.updateWidgetConfig(this.config.widget.id, localConfigValue, customConfig)
		},
	},
	computed: {
		styles() {
			const { layout } = this.config
			return {
				width: `${layout.size.width}px`,
				height: `${layout.size.height}px`,
				zIndex: `${layout.zIndex}`,
				transform: `translate3d(${layout.position.left}px, ${layout.position.top}px,0) ${
					layout.scale ? 'scale(' + layout.scale + ')' : ''
				}`,
			}
		},
		id() {
			const now = +new Date()
			if (this.config) {
				if (this.config.widget) {
					return `d-${this.config.widget.id ? this.config.widget.id : ''}${now}`
				}
				return `d-${now}`
			}
			return `d-${now}`
		},
		isSceneActive() {
			if (!this.config) return false
			if (!this.config.event.scene.length) return false
			return (
				this.editor.activeWidgetId === this.config.widget.id &&
				this.config.event.scene.some(v => v.id === this.editor.activeSceneId)
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
