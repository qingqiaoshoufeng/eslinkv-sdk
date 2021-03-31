/**
 * @description 平台信息
 */
import Vue from 'vue'
import { store } from './index'

const isMac = /macintosh|mac os x/i.test(navigator.userAgent)
const alt = isMac ? '⌥' : 'Alt'
const ctrl = isMac ? '⌃' : 'Ctrl'
const shift = 'Shift'
const space = '空格'
const command = '⌘'
const mouseWheelImg = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ3ICg0NTM5NikgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNfbW91c2U8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0i55S75p2/IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iQXJ0Ym9hcmQtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwMi4wMDAwMDAsIC0zNi4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwMi4wMDAwMDAsIDM2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9ImljL21vdXNlL2dyZXk2MDAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuNTAwMDAwLCAwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJpY19tb3VzZV8yNHB4Ij4KICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjAgMCAxNSAwIDE1IDE2IDAgMTYiPjwvcG9seWdvbj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTguMTI1LDAuNzEzMzMzMzMzIEw4LjEyNSw2IEwxMi41LDYgQzEyLjUsMy4yOCAxMC41OTM3NSwxLjA0IDguMTI1LDAuNzEzMzMzMzMzIFogTTIuNSwxMCBDMi41LDEyLjk0NjY2NjcgNC43Mzc1LDE1LjMzMzMzMzMgNy41LDE1LjMzMzMzMzMgQzEwLjI2MjUsMTUuMzMzMzMzMyAxMi41LDEyLjk0NjY2NjcgMTIuNSwxMCBMMTIuNSw3LjMzMzMzMzMzIEwyLjUsNy4zMzMzMzMzMyBMMi41LDEwIFogTTYuODc1LDAuNzEzMzMzMzMzIEM0LjQwNjI1LDEuMDQgMi41LDMuMjggMi41LDYgTDYuODc1LDYgTDYuODc1LDAuNzEzMzMzMzMzIFoiIGlkPSJTaGFwZSIgZmlsbD0iIzhDOTA5NyIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS0yIiBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkE5MDAiIHg9IjYuNSIgeT0iMiIgd2lkdGg9IjMiIGhlaWdodD0iNyIgcng9IjEuNSI+PC9yZWN0PgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4='
const mouseLeftImg = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTVweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTUgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ3ICg0NTM5NikgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNfbW91c2VfbGVmdDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSLnlLvmnb8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZC0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTYuMDAwMDAwLCAtNDIuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJpY19tb3VzZV9sZWZ0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1Ni4wMDAwMDAsIDQyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjAgMCAxNSAwIDE1IDE2IDAgMTYiPjwvcG9seWdvbj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik04LjEyNSwwLjcxMzMzMzMzMyBMOC4xMjUsNiBMMTIuNSw2IEMxMi41LDMuMjggMTAuNTkzNzUsMS4wNCA4LjEyNSwwLjcxMzMzMzMzMyBaIE0yLjUsMTAgQzIuNSwxMi45NDY2NjY3IDQuNzM3NSwxNS4zMzMzMzMzIDcuNSwxNS4zMzMzMzMzIEMxMC4yNjI1LDE1LjMzMzMzMzMgMTIuNSwxMi45NDY2NjY3IDEyLjUsMTAgTDEyLjUsNy4zMzMzMzMzMyBMMi41LDcuMzMzMzMzMzMgTDIuNSwxMCBaIiBpZD0iU2hhcGUiIGZpbGw9IiM5RkEyQTgiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTYuODc1LDAuNzEzMzMzMzMzIEM0LjQwNjI1LDEuMDQgMi41LDMuMjggMi41LDYgTDYuODc1LDYgTDYuODc1LDAuNzEzMzMzMzMzIFoiIGlkPSJQYXRoIiBmaWxsPSIjRkZBOTAwIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=='
const mouseRightImg = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTVweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTUgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ3ICg0NTM5NikgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNfbW91c2VfbGVmdDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSLnlLvmnb8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZC0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTYuMDAwMDAwLCAtNDIuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJpY19tb3VzZV9sZWZ0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1Ni4wMDAwMDAsIDQyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjAgMCAxNSAwIDE1IDE2IDAgMTYiPjwvcG9seWdvbj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik04LjEyNSwwLjcxMzMzMzMzMyBMOC4xMjUsNiBMMTIuNSw2IEMxMi41LDMuMjggMTAuNTkzNzUsMS4wNCA4LjEyNSwwLjcxMzMzMzMzMyBaIE0yLjUsMTAgQzIuNSwxMi45NDY2NjY3IDQuNzM3NSwxNS4zMzMzMzMzIDcuNSwxNS4zMzMzMzMzIEMxMC4yNjI1LDE1LjMzMzMzMzMgMTIuNSwxMi45NDY2NjY3IDEyLjUsMTAgTDEyLjUsNy4zMzMzMzMzMyBMMi41LDcuMzMzMzMzMzMgTDIuNSwxMCBaIiBpZD0iU2hhcGUiIGZpbGw9IiM5RkEyQTgiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTYuODc1LDAuNzEzMzMzMzMzIEM0LjQwNjI1LDEuMDQgMi41LDMuMjggMi41LDYgTDYuODc1LDYgTDYuODc1LDAuNzEzMzMzMzMzIFoiIGlkPSJQYXRoIiBmaWxsPSIjRkZBOTAwIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=='

function getInitRuler () {
	return {
		dragId: `drag-content-${+new Date()}`,
		origin: '',
		xRoom: 238,
		xRoomR: 350,
		yRoom: 60,
		guideLines: [], // 参考线
		guideStartX: 0, // 参考线开始移动的位置
		guideStartY: 0, // 参考线开始移动的位置
		guideVisible: true, // 参考线可见
		contentX: 0, // 当前位置x
		contentY: 0, // 当前位置y
		contentScrollLeft: 0, // 滚动距离
		contentScrollTop: 0, // 滚动距离
		guideDrag: false, // 点击拖拽参考线
		dragGuideId: '', // 被移动线的ID
		stepLength: 50, // 标尺步长
		size: 18, // 标尺高度，容差
		zoom: 1,
		contentLayout: {
			top: 0, left: 0 // 刻度修正，根据 contentLayout 参数确定 0 刻度位置
		},
		dragFlag: '' // 拖动开始标记，可能值x(从水平标尺开始拖动),y(从垂直标尺开始拖动)
	}
}

function getInitPanelConfig () {
	return { // 看板配置
		id: null,
		info: {
			id: '',
			name: '未命名',
			remark: ''
		},
		size: {
			width: 1920,
			height: 1080,
			unit: 'px',
			preset: '1920×1080',
			isMobileKanboard: false,
			deviceType: 'mobile',
			layoutMode: 'full-size'
		},
		background: {
			url: '',
			size: 'cover',
			position: 'center',
			repeat: 'no-repeat',
			color: 'rgba(24, 27, 36,1)'
		}
	}
}

const state = Vue.observable({
	version: '1.0.3',
	widgetAdded: {},
	chooseWidgetCustomConfig: [], // 选中项的自定义配置
	chooseWidgetId: null, // 选中项id
	chooseWidgetState: true, // 是否可编辑
	panelConfig: getInitPanelConfig(),
	isMac, // 是否是mac
	fullscreen: false, // 全屏
	hotKeys: [ // 热键
		{ name: '清除全部参考线', key: [{ value: alt, type: 'text' }, { type: '+' }, { value: 'C', type: 'text' }] },
		{ name: '缩放画布', key: [{ value: ctrl, type: 'text' }, { type: '+' }, { value: mouseWheelImg, type: 'img' }] },
		{ name: '移动画布', key: [{ value: space, type: 'text' }] },
		{ name: '水平移动画布', key: [{ value: shift, type: 'text' }, { type: '+' }, { value: mouseWheelImg, type: 'img' }] },
		{ name: '垂直移动画布', key: [{ value: mouseWheelImg, type: 'img' }] },
		{ name: '居中画布', key: [{ value: mouseLeftImg, type: 'img' }, { type: '+' }, { value: mouseLeftImg, type: 'img' }] }
	],
	autoAlignGuide: true, // 自动贴靠参考线
	ruler: getInitRuler()
})
const actions = {
	zoomIn () {
		if (state.ruler.zoom < 4) {
			state.ruler.zoom = (state.ruler.zoom * 10 + 1) / 10
		}
	},
	zoomOut () {
		if (state.ruler.zoom > 0.1) {
			state.ruler.zoom = (state.ruler.zoom * 10 - 1) / 10
		}
	},
	initKanboard () {
		state.ruler = getInitRuler()
		state.panelConfig = getInitPanelConfig()
		state.widgetAdded = {}
	},
	deleteCurrentGuideLine () {
		const guideIndex = state.ruler.guideLines.findIndex(guide => guide.id === state.ruler.dragGuideId)
		state.ruler.guideLines.splice(guideIndex, 1)
		state.ruler.dragGuideId = ''
	},
	changeGuideLine (site) {
		const guideIndex = state.ruler.guideLines.findIndex(guide => guide.id === state.ruler.dragGuideId)
		state.ruler.guideLines[guideIndex].site = site
	},
	guideAdd (site) {
		const line = state.ruler.guideLines
		const type = state.ruler.dragFlag = state.ruler.dragFlag === 'x' ? 'v' : state.ruler.dragFlag === 'y' ? 'h' : state.ruler.dragFlag
		line.push({
			id: `${type}_${state.ruler.guideLines.length}`,
			type,
			title: `${site}px`,
			site
		})
		state.ruler.guideLines = line
	},
	unChooseWidget () {
		state.chooseWidgetState = true
	},
	chooseWidget (id) {
		state.chooseWidgetId = id
		state.chooseWidgetState = false
	},
	setChooseWidgetCustomConfig (value = []) {
		if (value.length > 0) {
			state.chooseWidgetCustomConfig = [...value, { type: 'custom' }]
		}
	},
	updateApiData (id, data) {
		if (!state.widgetAdded[id].config.api) {
			Vue.set(state.widgetAdded[id].config, 'api', {})
		}
		Vue.set(state.widgetAdded[id].config.api, 'data', JSON.stringify(data))
	},
	updateConfig (id, config) {
		Vue.set(state.widgetAdded[id], 'config', config)
	},
	setWidgetsAdded (value) {
		state.widgetAdded = value
	},
	setWidgetsAddedItem (id, type, config, scene, market = false) {
		Vue.set(state.widgetAdded, id, {
			id,
			type,
			config,
			scene,
			market
		})
	}
}
const platform = store('platform', state, actions)

export default platform
