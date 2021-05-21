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
	activeWidgetId: '', // 被激活的场景对应组件
	activeSceneId: 0, // 被激活的场景id
	index: 0, // 当前主场景id
	list: [],
	obj: {},
	showAnimationStyle: '',
	transferData: null, // 场景交互时传递的数据
	status: 'inEdit', // inEdit  在编辑器中  inPreview 在预览中
	sceneObj: {},
	widgetLoaded: {},
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
		const widgets = Object.values(platform.state.widgetAdded)
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
	destroyScene(index, showAnimationStyle = 'fadeOut') {
		if (state.status === 'inPreview') {
			if (state.showAnimationStyle) {
				document
					.getElementById(index)
					.classList.remove(state.showAnimationStyle)
			}
			if (showAnimationStyle) {
				document.getElementById(index).classList.add(showAnimationStyle)
			}
			const event = new CustomEvent('DestroyScene', { detail: { index } })
			document.dispatchEvent(event)
			setTimeout(() => {
				state.activeSceneId = 0
				document.getElementById(index).parentNode.remove()
				instance.actions.setInstance('createKanboard', null) // 初始化实例场景
				instance.actions.setInstance('createComp', null) // 初始化实例场景
				state.showAnimationStyle = '' // 初始化实例场景
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
			const kanban = document.getElementById('screen')
			const transform = kanban.style.transform
			const canvasStyle = `position: relative;transition: all .3s;flex-shrink: 0;flex-grow: 0;width:${kanban.clientWidth}px;height:${kanban.clientHeight}px;overflow: hidden;background-color:transparent;z-index: 99999;`
			const array = state.sceneObj[id].list
			const _self = instance.state.kanboard
			state.showAnimationStyle = showAnimationStyle
			const Comp = Vue.extend({
				template: `<div class="scene-temporary-container fn-flex"
style="pointer-events:${pointerEvents};position:fixed;left:0;top:0;right:0;bottom:0;z-index: 99999;justify-content: center;align-items: center;">
					<div id="${id}" class="scene-temporary-wrapper animated" style="${canvasStyle}">
						<parts
						readonly
						:market="item.market"
						:ref="item.id"
						:config="item.config"
						:type="item.type"
						v-for="item in array"
						:key="item.id"/>
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
			state.activeSceneId = id
			document
				.getElementsByClassName('detail-container')[0]
				.appendChild(comp.$el)
			document.getElementById(id).parentNode.style.transform = transform
			if (showAnimationStyle)
				document.getElementById(id).classList.add(showAnimationStyle)
		}
	},
}
const scene = store('scene', state, actions)

export default scene
