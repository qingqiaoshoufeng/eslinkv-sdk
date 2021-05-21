/**
 * @description 平台信息
 */
import Vue from 'vue'
import { store } from './index'

const isMac = /macintosh|mac os x/i.test(navigator.userAgent)

const state = Vue.observable({
	version: '1.1.0',
	screenVersion: 0,
	widgetAdded: {},
	screenAvatar: '',
	screenType: 'CUSTOM', // CUSTOM 普通大屏 TEMPLATE 模版大屏
	screenId: null,
	screenName: '未命名',
	chooseWidgetCustomConfig: [], // 选中项的自定义配置
	chooseWidgetId: null, // 选中项id
	chooseWidgetArray: [], // 选中项ids
	chooseWidgetArrayConfig: {
		left: 0,
		top: 0,
		width: 0,
		height: 0,
		z: 0,
	}, // 选中项配置
	backgroundImage: '',
	backgroundColor: 'rgba(24, 27, 36,1)',
	width: 1920,
	height: 1080,
	isMobile: false,
	layoutMode: 'full-height',
	mainScene: 0, // 设置进入场景

	isMac, // 是否是mac
	fullscreen: false, // 全屏
	searchModal: false,
	autoAlignGuide: true, // 自动贴靠参考线
})
const actions = {
	initPlatformConfig() {
		state.screenName = '未命名'
		state.screenAvatar = ''
		state.widgetAdded = {}
	},
	unChooseWidget() {
		state.chooseWidgetId = null
		state.chooseWidgetArray = []
		document.getElementById('right-menu').classList.remove('active')
	},
	chooseWidget(id) {
		state.chooseWidgetId = id
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
		if (state.widgetAdded[id])
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
