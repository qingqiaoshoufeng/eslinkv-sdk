import fetch from '@/vue2/fetch'
import dataProcess from '@/vue2/data-process.js'
import { createSandbox } from '@/vue2/data-process'
import { usePath } from '@/vue2/utils'
import Editor from '@/core/Editor'

export default {
	mixins: [fetch, dataProcess],
	props: {
		__settingData__: {
			type: Object,
		},
		events: {
			type: Object,
			default() {
				return {}
			},
		},
		config: {
			type: Object,
			default() {
				return {}
			},
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
	beforeDestroy(): void {
		this.instance = null
		clearInterval(this.animateTimer)
		clearTimeout(this.animateTimer)
		this.animateTimer = null
		this.animateActiveIndex = -1
	},
	methods: {
		eventTypesSetting(eventTypes): void {
			this.editor.eventTypesSetting(this.config.widget.id, eventTypes)
		},
		dataSetting(list = [], data): void {
			this.editor.dataSetting(this.config.widget.id, list, data)
		},
		setCustomEvent(event): void {
			this.editor.setCustomEvent(this.config.widget.id, event)
		},
		setCustomEventConfig(val): void {
			this.editor.setCustomEventConfig(this.config.widget.id, val)
		},
		__handleEvent__(eventType = 'click', val): void {
			if (this.events) {
				if (!this.events[eventType]) {
					console.error(`自定义事件：${eventType} 未初始化`)
					return
				}
				for (const item of this.events[eventType]) {
					if (item.eventClass === 'scene') {
						const sceneId = item.id
						switch (item.triggerType) {
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
					if (item.eventClass === 'component') {
						const coms = Object.values(this.editor.screenWidgets).filter((v: any) =>
							item.ids.includes(v.id),
						)
						let data = usePath('', val)
						const { enable, methodBody } = item.process
						if (enable && methodBody.trim()) {
							try {
								const processor = createSandbox(methodBody)
								data = processor({ data })
								coms.forEach((v: any) => {
									if (
										!['config.api.params', 'config.api.data', 'config.config'].includes(
											item.triggerType,
										)
									) {
										v.__handleCustomEvent__[item.triggerType](data)
									} else {
										this.editor.updateComponentTarget(v.id, item.triggerType, data)
									}
								})
							} catch (err) {
								console.warn('数据加工函数语法错误：', err.message)
								this.$Message.warning('数据加工函数语法错误：' + err.message)
							}
						} else {
							coms.forEach((v: any) => {
								if (
									!['config.api.params', 'config.api.data', 'config.config'].includes(
										item.triggerType,
									)
								) {
									v.__handleCustomEvent__[item.triggerType](data)
								} else {
									this.editor.updateComponentTarget(v.id, item.triggerType, data)
								}
							})
						}
					}
				}
			} else {
				this.eventTypesSetting([{ key: 'click', label: '点击事件' }])
			}
		},
		__handleClick__(val): void {
			this.__handleEvent__('click', val)
		},
		/**
		 * @description 组件间联动，被关联组件收动添加 updateComponent 方法
		 * [id]
		 */
		emitComponentUpdate(data): void {
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
		widgetId(): string {
			if (this.config) {
				if (this.config.widget) {
					return this.config.widget.id
				}
			}
			return ''
		},
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
		id(): string {
			const now = +new Date()
			return `d-${now}`
		},
		eventLength(): number {
			return Object.keys(this.events).length
		},
		isSceneActive(): boolean {
			if (!this.events) return false
			const events = this.events
			let e = []
			for (const key in events) {
				e = [...e, ...events[key]]
			}
			return (
				this.editor.activeWidgetId === this.config.widget.id && e.some(v => v.id === this.editor.activeSceneId)
			)
		},
	},
	watch: {
		configReady(value): void {
			if (value) {
				requestAnimationFrame(() => {
					this.readonly && this.$el.classList.add('readonly')
					this.ready = true
				})
			}
		},
	},
	mounted(): void {
		this.inPreview = this.editor.editorStatus === 'inPreview'
	},
}
