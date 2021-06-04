/**
 * @description 场景
 */

import Vue from 'vue'
import instance from './instance.store'
import { store } from './index'
import Editor from '@/core/Editor'

const state = Vue.observable({
	activeWidgetId: '', // 被激活的场景对应组件
	activeSceneId: 0, // 被激活的场景id
	obj: {},
	showAnimationStyle: '',
	sceneObj: {},
})
const actions = {
	// 兼容老组件后期会删除
	setSceneIndex(index) {
		Vue.prototype.$screen.setSceneIndex(index)
	},
	destroyScene(index, showAnimationStyle = 'fadeOut') {
		if (Vue.prototype.$screen.status === 'inPreview') {
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
	createSceneInstance(
		id,
		showAnimationStyle = 'fadeIn',
		pointerEvents = 'auto',
	) {
		Editor.openScene(id)
// 		if (Vue.prototype.$screen.status === 'inPreview') {
// 			const kanban = document.getElementById('screen')
// 			const transform = kanban.style.transform
// 			const canvasStyle = `position: relative;transition: all .3s;flex-shrink: 0;flex-grow: 0;width:${kanban.clientWidth}px;height:${kanban.clientHeight}px;overflow: hidden;background-color:transparent;z-index: 99999;`
// 			const array = Vue.prototype.$screen.sceneWidgets[id].list
// 			const _self = instance.state.kanboard
// 			state.showAnimationStyle = showAnimationStyle
// 			const Comp = Vue.extend({
// 				template: `<div class="scene-temporary-container fn-flex"
// style="pointer-events:${pointerEvents};position:fixed;left:0;top:0;right:0;bottom:0;z-index: 99999;justify-content: center;align-items: center;">
// 					<div id="${id}" class="scene-temporary-wrapper animated" style="${canvasStyle}">
// 						<parts
// 						readonly
// 						:market="item.market"
// 						:ref="item.id"
// 						:config="item.config"
// 						:type="item.type"
// 						v-for="item in array"
// 						:key="item.id"/>
// 					</div></div>`,
// 				provide() {
// 					return { kanboardEditor: _self }
// 				},
// 				data() {
// 					return {
// 						array,
// 					}
// 				},
// 				components: { parts },
// 				mounted() {
// 					instance.actions.setInstance('createKanboard', this)
// 				},
// 			})
// 			const comp = new Comp().$mount()
// 			state.activeSceneId = id
// 			document
// 				.getElementsByClassName('detail-container')[0]
// 				.appendChild(comp.$el)
// 			document.getElementById(id).parentNode.style.transform = transform
// 			if (showAnimationStyle)
// 				document.getElementById(id).classList.add(showAnimationStyle)
// 		}
	},
}
const scene = store('scene', state, actions)

export default scene
