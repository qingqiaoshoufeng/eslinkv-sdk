import platform from '../../store/platform.store'
import scene from '../../store/scene.store'
import { getQueryString } from '../../utils/index'
import Platform from '@/controller/Platform'

export default {
	data() {
		return {
			platform: platform.state,
		}
	},
	methods: {
		renderByDetail(res) {
			this.refillConfig(res.screenConfig)
		},
		refillConfig(res) {
			this.loading = true
			const { widgets } = res,
				marketComponents = [],
				obj = {},
				p = [],
				needMarketLoad = {}
			widgets.forEach(item => {
				obj[item.id] = {
					id: item.id,
					market: item.market,
					scene: item.scene,
					type: item.type,
					config: item.value,
				}
				if (item.market) {
					marketComponents.push({
						type: item.type,
						version: item.value.widget.componentVersion,
					})
				}
			})
			marketComponents.forEach(item => {
				if (needMarketLoad[`${item.type}${item.version}`]) return
				needMarketLoad[`${item.type}${item.version}`] = true
				p.push(
					new Promise((resolve, reject) => {
						this.$api.marketComponent
							.use({
								componentEnTitle: item.type,
								componentVersion: item.version,
							})
							.then(res => {
								const script = document.createElement('script')
								script.onload = () => {
									resolve(1)
								}
								script.onerror = () => {
									reject(1)
								}
								script.src = res.componentJsUrl
								document.head.appendChild(script)
							})
					}),
				)
			})
			Promise.all(p)
				.then(() => {
					this.loading = false
					platform.actions.setWidgetsAdded(obj)
					if (res.scene) {
						scene.actions.initScene(res)
					}
				})
				.catch(() => {
					this.loading = false
					this.$Message.error('组件初始化加载失败')
				})
		},
	},
	mounted() {
		const templateId = this.$route.query.templateId
		const id = this.$route.params.id || templateId
		const file = this.$route.params.file
		// if (file) {
		// 	new Platform({ fileUrl: file, isLocalFile: true })
		// }
		// if (id) {
		// 	new Platform({ screenId: id })
		// }

		if (id) {
			this.$api.screen.detail({ screenId: id }).then(res => {
				this.platform.screenType = res.screenType
				this.platform.screenAvatar = res.screenAvatar
				this.platform.screenName = res.screenName
				this.platform.panelConfig = res.screenConfig.kanboard
					? res.screenConfig.kanboard
					: res.screenConfig.panelConfig
				this.renderByDetail(res)
			})
		}
		if (file) {
			this.$api.screen.detailFile(decodeURIComponent(file)).then(res => {
				this.platform.panelConfig = res.screenConfig.kanboard
					? res.screenConfig.kanboard
					: res.screenConfig.panelConfig
				this.renderByDetail(res)
			})
		}
		/**
		 * @description 默认场景
		 */
		if (getQueryString('scene')) {
			scene.actions.setSceneIndex(getQueryString('scene'))
		}
	},
}
