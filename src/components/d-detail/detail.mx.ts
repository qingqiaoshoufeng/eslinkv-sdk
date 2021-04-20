import platform from '../../store/platform.store'
import scene from '../../store/scene.store'
import { getQueryString } from '../../utils/index'

// todo 加载动画 下面注释部分
export default {
	data() {
		return {
			platform: platform.state,
		}
	},
	methods: {
		renderByDetail(res) {
			if (res.screenConfig.scene) {
				scene.actions.initScene(res.screenConfig)
			}
			this.platform.screenName = res.screenName
			this.refillConfig(res.screenConfig)
		},
		refillConfig(res) {
			this.loading = true
			const { widgets, kanboard } = res,
				marketComponents = [],
				obj = {},
				p = [],
				needMarketLoad = {}
			this.platform.panelConfig = kanboard
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
		if (id) {
			this.$api.screen.detail({ screenId: id }).then(res => {
				this.screenType = res.screenType
				this.platform.screenAvatar = res.screenAvatar
				this.renderByDetail(res)
			})
		}
		if (file) {
			this.$api.screen.detailFile(decodeURIComponent(file)).then(res => {
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
