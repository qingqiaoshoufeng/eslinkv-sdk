/**
 * @description 平台信息
 */
import Vue from 'vue'
import { store } from './index'

const isMac = /macintosh|mac os x/i.test(navigator.userAgent)

function getInitPanelConfig() {
	return {
		// 看板配置
		size: {
			width: 1920,
			height: 1080,
			unit: 'px',
			isMobile: false,
			layoutMode: 'full-height',
		},
		background: {
			url: '',
			color: 'rgba(24, 27, 36,1)',
		},
		mainScene: 0, // 设置进入场景
	}
}

const state = Vue.observable({
	version: '1.0.3',
	widgetAdded: {},
	screenAvatar: '',
	screenName: '未命名',
	chooseWidgetCustomConfig: [], // 选中项的自定义配置
	chooseWidgetId: null, // 选中项id
	chooseWidgetState: true, // 是否可编辑
	panelConfig: getInitPanelConfig(),
	isMac, // 是否是mac
	fullscreen: false, // 全屏
	autoAlignGuide: true, // 自动贴靠参考线
})
const actions = {
	initPlatformConfig() {
		state.screenName = '未命名'
		state.screenAvatar = ''
		state.panelConfig = getInitPanelConfig()
		state.widgetAdded = {}
	},
	unChooseWidget() {
		state.chooseWidgetState = true
		state.chooseWidgetId = null
		document.getElementById('right-menu').classList.remove('active')
	},
	chooseWidget(id) {
		state.chooseWidgetId = id
		state.chooseWidgetState = false
	},
	setChooseWidgetCustomConfig(value = []) {
		state.chooseWidgetCustomConfig = [...value, { type: 'custom' }]
	},
	updateApiData(id, data) {
		if (!state.widgetAdded[id].config.api) {
			Vue.set(state.widgetAdded[id].config, 'api', {})
		}
		Vue.set(state.widgetAdded[id].config.api, 'data', JSON.stringify(data))
	},
	updateConfig(id, config) {
		Vue.set(state.widgetAdded[id], 'config', config)
	},
	setWidgetsAdded(value) {
		state.widgetAdded = value
	},
	setWidgetsAddedItem(id, type, config, scene, market = false) {
		Vue.set(state.widgetAdded, id, {
			id,
			type,
			config,
			scene,
			market,
		})
	},
}
const platform = store('platform', state, actions)

export default platform
