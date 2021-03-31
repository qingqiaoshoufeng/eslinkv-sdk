import widgetMixin from '../mixins'
import { configMerge } from '../src/utils'
import dEditor from '../src/components/d-editor/index.vue'
import platform from '../src/store/platform.store.js'
import commonConfigValue from '../common-config-value.js'
import dWidgetList from '../src/components/d-widget-list/index.vue'
import dRightManage from '../src/components/d-right-manage/index.vue'
import dDetail from '../src/components/d-detail/index.vue'
import dFooter from '../src/components/d-footer/index.vue'
import scene from '../src/store/scene.store'
import instance from '../src/store/instance.store'
import custom from '../src/store/custom.store'
import event from '../src/store/event.store.js'
import dView from '../src/components/d-view/index.vue'
import loadMask from '../src/components/load-mask/index.vue'
import '../src/plugins'
import market from '../src/plugins/market.ts'
import './other.js'
import { requestNoBaseURL } from '../src/api/request'

const eslinkV = {
    widgetMixin,
    dEditor,
    request: requestNoBaseURL,
    platform,
    configMerge,
    commonConfigValue,
    dWidgetList,
    dDetail,
    dRightManage,
    dFooter,
    scene,
    instance,
    custom,
    event,
    dView,
    loadMask,
    market
}
if (!window.eslinkV) {
    window.eslinkV = {}
}
window.eslinkV = { ...window.eslinkV, ...eslinkV }

export default window.eslinkV
