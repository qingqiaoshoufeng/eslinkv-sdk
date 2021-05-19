import { detail, detailFile } from '@/api/screen.api.js'
import { use } from '@/api/marketComponent.api.js'
import platform from '@/store/platform.store.js'
import scene from '@/store/scene.store.js'
import { getQueryString } from '@/utils/index.js'

export default class Platform {
	/*初始化获取大屏数据*/
	constructor(config: platformInitConfig) {
		platform.state.screenId = config.screenId
		if (config.isLocalFile) {
			detailFile(decodeURIComponent(config.fileUrl)).then(
				(res: platformInitResult) => {
					platform.state.panelConfig = res.screenConfig.kanboard
						? res.screenConfig.kanboard
						: res.screenConfig.panelConfig
					this.refillConfig(res)
				},
			)
		} else {
			detail({ screenId: config.screenId }).then(
				(res: platformInitResult) => {
					platform.state.screenType = res.screenType
					platform.state.screenAvatar = res.screenAvatar
					platform.state.screenName = res.screenName
					platform.state.panelConfig = res.screenConfig.kanboard
						? res.screenConfig.kanboard
						: res.screenConfig.panelConfig
					this.refillConfig(res)
				},
			)
		}
		this.showDefaultScene()
	}

	/*切换至默认场景*/
	showDefaultScene() {
		const sceneIndex = getQueryString('scene')
		if (sceneIndex) {
			console.log(sceneIndex)
			scene.actions.setSceneIndex(sceneIndex)
		}
	}

	/*格式化配置数据，加载来自组件市场的组件*/
	refillConfig(res: platformInitResult) {
		const marketComponents: { type: string; version: string }[] = []
		const obj: { [key: string]: widgetConfig } = {}
		const p = []
		const needMarketLoad: { [key: string]: boolean } = {}
		res.screenConfig.widgets.forEach((item: widgetConfigOriginal) => {
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
				new Promise<number>((resolve, reject) => {
					use({
						componentEnTitle: item.type,
						componentVersion: item.version,
					}).then((res: widgetUseResult) => {
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
				platform.actions.setWidgetsAdded(obj)
				if (res.screenConfig.scene) {
					scene.actions.initScene(res.screenConfig)
				}
			})
			.catch(() => {
				console.error('组件初始化加载失败')
			})
	}
}
