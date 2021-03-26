import platform from '../../store/platform.store'
import scene from '../../store/scene.store'
import { getQueryString } from '../../utils/index'

// todo 加载动画 下面注释部分
export default {
    methods: {
        renderByDetail (res) {
            if (res.screenConfig.scene) {
                scene.actions.initScene(res.screenConfig)
            }
            this.refillConfig(res.screenConfig)
        },
        refillConfig (res) {
            const {
                widgets,
                kanboard,
                guides
            } = res
            this.platform.panelConfig = kanboard
            this.platform.ruler.guideLines = guides
            // this.querying = false
            // this.apis = apis
            return new Promise(resolve => {
                // this.refilling = true
                const widgetsArray = Object.values(widgets)
                const length = widgetsArray.length
                // 小工具初始化需要时间，此处进行延时逐个回填
                const reDrawWidget = (obj) => {
                    const {
                        id,
                        type,
                        value,
                        scene = 0,
                        market = false
                    } = obj
                    platform.actions.setWidgetsAddedItem(id, type, value, scene, market)
                    const currentLength = widgetsArray.length
                    if (currentLength) {
                        // this.refillPercent = (length - currentLength) / length * 100 | 0
                        reDrawWidget(widgetsArray.shift())
                    } else {
                        // this.refillPercent = 100
                        // this.refilling = false
                        resolve(true)
                    }
                }
                if (length) {
                    reDrawWidget(widgetsArray.shift())
                } else {
                    // this.refilling = false
                    // this.refillPercent = 100
                    resolve(true)
                }
            })
        }
    },

    mounted () {
        const templateId = this.$route.query.templateId
        const id = this.$route.params.id || templateId
        const file = this.$route.params.file
        if (id) {
            this.$api.screen.detail({ screenId: id }).then(res => {
                this.screenType = res.screenType
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
    }
}
