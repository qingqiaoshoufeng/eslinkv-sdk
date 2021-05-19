import { detail, detailFile } from '@/api/screen.api.js'
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
}
