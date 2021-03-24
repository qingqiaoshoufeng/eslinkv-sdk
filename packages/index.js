import widgetMixin from '../mixins'
import { configMerge } from '../src/utils'
import dEditor from '../src/components/d-editor/index.vue'
import platform from '../src/store/platform.store.js'
import commonConfigValue from '../common-config-value.js'
import dWidgetList from '../src/components/d-widget-list/index.vue'
import dFooter from '../src/components/d-footer/index.vue'
import scene from '../src/store/scene.store'
import instance from '../src/store/instance.store'
import custom from '../src/store/custom.store'
import event from '../src/store/event.store.js'
import dView from '../src/components/d-view/index.vue'
import loadMask from '../src/components/load-mask/index.vue'
import '../index.js'

const eslinkvNpm = {
    widgetMixin,
    dEditor,
    platform,
    configMerge,
    commonConfigValue,
    // 上面是example用到的
    dWidgetList,
    dFooter,
    scene,
    instance,
    custom,
    event,
    dView,
    loadMask
}

window.eslinkvNpm = eslinkvNpm

export default eslinkvNpm
