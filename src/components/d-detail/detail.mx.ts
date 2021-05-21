import platform from '../../store/platform.store'
import scene from '../../store/scene.store'
import { getQueryString } from '../../utils/index'

export default {
	data() {
		return {
			platform: platform.state,
			scene: scene.state,
		}
	},
	methods: {
		refillConfig(res: platformInitResult) {
			this.loading = true
			const marketComponents: { type: string; version: string }[] = []
			const obj: { [key: string]: widgetConfig } = {}
			const p = []
			res.screenConfig.widgets.forEach(item => {
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
				if (this.scene.widgetLoaded[`${item.type}${item.version}`])
					return
				this.scene.widgetLoaded[`${item.type}${item.version}`] = true
				p.push(
					new Promise<number>((resolve, reject) => {
						this.$api.marketComponent
							.use({
								componentEnTitle: item.type,
								componentVersion: item.version,
							})
							.then((res: widgetUseResult) => {
								const script = document.createElement('script')
								script.onload = () => {
									resolve(1)
								}
								script.onerror = () => {
									reject(1)
								}
								if (res) {
									script.src = res.componentJsUrl
									document.head.appendChild(script)
								} else {
									console.error(
										`${item.type}${item.version}加载组件失败`,
									)
								}
							})
					}),
				)
			})
			Promise.all(p)
				.then(() => {
					this.loading = false
					platform.actions.setWidgetsAdded(obj)
					if (res.screenConfig.scene) {
						scene.actions.initScene(res.screenConfig)
					}
				})
				.catch(() => {
					this.loading = false
					console.error('组件初始化加载失败')
				})
		},
	},
	mounted() {
		const templateId = this.$route.query.templateId
		const id = this.$route.params.id || templateId
		const file = this.$route.params.file
		if (id) {
			this.$api.screen
				.detail({ screenId: id })
				.then((res: platformInitResult) => {
					this.platform.screenType = res.screenType
					this.platform.screenAvatar = res.screenAvatar
					this.platform.screenName = res.screenName
					this.platform.backgroundImage =
						res.screenConfig.panelConfig.background.url
					this.platform.backgroundColor =
						res.screenConfig.panelConfig.background.color
					this.refillConfig(res)
				})
		}
		if (file) {
			this.$api.screen
				.detailFile(decodeURIComponent(file))
				.then((res: platformInitResult) => {
					this.platform.backgroundImage =
						res.screenConfig.panelConfig.background.url
					this.platform.backgroundColor =
						res.screenConfig.panelConfig.background.color
					this.refillConfig(res)
				})
		}
		/**
		 * @description 默认场景
		 */
		const sceneIndex = getQueryString('scene')
		if (sceneIndex) {
			scene.actions.setSceneIndex(sceneIndex)
		}
	},
}
