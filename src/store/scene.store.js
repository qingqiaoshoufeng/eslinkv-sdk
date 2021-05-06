/**
 * @description 场景
 */

import { uuid } from '../utils'
import parts from '../components/d-widget-part/index'
import Vue from 'vue'
import instance from './instance.store'
import platform from './platform.store'
import { store } from './index'

const state = Vue.observable({
	index: 0,
	list: [],
	obj: {},
	transferData: null, // 场景交互时传递的数据
	status: 'inEdit', // inEdit  在编辑器中  inPreview 在预览中
	sceneObj: {},
	showAnimationStyle: 'zoom', // 实例化场景，动画
})
const actions = {
	setStatus(status) {
		state.status = status
	},
	initScene(value) {
		const { scene } = value
		if (scene instanceof Array) {
			state.list = scene
			scene.forEach(item => {
				state.obj[item] = {
					name: `场景${item}`,
				}
			})
		} else {
			state.obj = scene
			const arr = []
			for (const key in scene) {
				arr.push({ name: scene[key].name, key })
			}
			arr.sort(function (a, b) {
				return a.name.localeCompare(b.name)
			})
			state.list = arr.map(item => item.key)
		}
		const widgets = value.widgets
		const list = state.list
		widgets.forEach(item => {
			const index = list.indexOf(item.scene)
			if (index !== -1) {
				if (!state.sceneObj[list[index]]) {
					state.sceneObj[list[index]] = {}
				}
				if (!state.sceneObj[list[index]].list) {
					state.sceneObj[list[index]].list = []
				}
				state.sceneObj[list[index]].list.push(item)
			}
		})
	},
	setSceneName(key, name) {
		state.obj[key].name = name.replace(/ /g, '')
	},
	setSceneIndex(index) {
		if (index !== state.index) {
			state.index = index
		}
		let event = new CustomEvent('SceneIndex', { detail: { index } })
		document.dispatchEvent(event)
		event = null
	},
	createScene() {
		const name = uuid()
		state.list.push(name)
		state.obj[name] = { name: `场景${name}` }
		state.index = name
	},
	destroyScene(index) {
		if (state.status === 'inPreview') {
			const showAnimationStyle = state.showAnimationStyle
			switch (showAnimationStyle) {
				case 'fadeIn':
					document.getElementById(index).style.opacity = '0'
					break
				case 'zoomIn':
					document.getElementById(index).style.transform = 'scale(0)'
					break
				case 'slideUp':
					document.getElementById(index).style.bottom = '-80%'
					break
				case 'slideRight':
					document.getElementById(index).style.right = '-80%'
					break
			}
			const event = new CustomEvent('DestroyScene', { detail: { index } })
			document.dispatchEvent(event)
			setTimeout(() => {
				document.getElementById(index).parentNode.remove()
				instance.actions.setInstance('createKanboard', null) // 初始化实例场景
				instance.actions.setInstance('createComp', null) // 初始化实例场景
				state.showAnimationStyle = 'fadeIn' // 初始化实例场景
			}, 300)
		}
	},
	deleteScene(index) {
		delete state.obj[index]
		delete state.sceneObj[index]
		state.list.splice(index, 1)
	},
	createSceneInstance(
		id,
		showAnimationStyle = 'fadeIn',
		pointerEvents = 'auto',
	) {
		if (state.status === 'inPreview') {
			const widgets = Object.values(platform.state.widgetAdded)
			state.sceneObj[id].list = []
			widgets.forEach(item => {
				if (item.scene === id) {
					state.sceneObj[id].list.push({
						...item,
						value: item.config,
					})
				}
			})

			const kanban = document.getElementById('screen')
			const transform = kanban.style.transform
			const canvasStyle = `position: relative;transition: all .3s;flex-shrink: 0;flex-grow: 0;transform:scale(0);width:${kanban.clientWidth}px;height:${kanban.clientHeight}px;overflow: hidden;background-color:transparent;z-index: 99999;`
			const array = state.sceneObj[id].list
			const _self = instance.state.kanboard
			state.showAnimationStyle = showAnimationStyle
			const Comp = Vue.extend({
				template: `<div class="scene-temporary-container fn-flex"
style="pointer-events:${pointerEvents};position:fixed;left:0;top:0;right:0;bottom:0;z-index: 99999;justify-content: center;align-items: center;">
					<div id="${id}" class="scene-temporary-wrapper" style="${canvasStyle}">
						<parts
						readonly
						:market="item.market"
						:ref="item.id"
						:config="item.value"
						:type="item.type"
						v-for="item in array"
						:key="item.id + new Date().getTime()"/>
					</div></div>`,
				provide() {
					return { kanboardEditor: _self }
				},
				data() {
					return {
						array,
					}
				},
				components: { parts },
				mounted() {
					instance.actions.setInstance('createKanboard', this)
				},
			})
			const comp = new Comp().$mount()
			instance.actions.setInstance('createComp', comp)
			document
				.getElementsByClassName('detail-container')[0]
				.appendChild(comp.$el)
			switch (showAnimationStyle) {
				case 'zoomIn':
					setTimeout(() => {
						document.getElementById(id).style.transform = transform
					}, 300)
					break
				case 'slideRight':
					document.getElementById(id).style.transform = transform
					document.getElementById(id).style.right = '-80%'
					setTimeout(() => {
						document.getElementById(id).style.right = '0'
					}, 300)
					break
				case 'slideUp':
					document.getElementById(id).style.transform = transform
					document.getElementById(id).style.bottom = '-80%'
					setTimeout(() => {
						document.getElementById(id).style.bottom = '0'
					}, 300)
					break
				case 'fadeIn':
				default:
					document.getElementById(id).style.transform = `${transform}`
					document.getElementById(id).style.opacity = '0'
					setTimeout(() => {
						document.getElementById(id).style.opacity = '1'
					}, 300)
					break
			}
		}
	},
}
const scene = store('scene', state, actions)

export default scene
