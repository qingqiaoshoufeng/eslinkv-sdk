<template lang="pug">
// 操作区
// todo css 改造 适配组件嵌入式，非全屏
#d-editor.d-editor.pos-r(
	ref="canvas-wrapper",
	:class="{ fullscreen: screen.fullscreen }",
	:style="{ width: `calc(100% - ${ruler.xRoomL1 + ruler.xRoomL2 + ruler.xRoomR1}px)`, marginLeft: `${ruler.xRoomL1 + ruler.xRoomL2}px` }",
	@contextmenu.stop.prevent)
	// 标尺容器
	d-ruler(ref="rulerCanvas")
		// 大屏
		#screen.canvas-wrapper.pos-r(
			:style="canvasStyle",
			@drop="drop",
			@click.stop,
			@dragover.prevent)
			// 小工具清单
			item-card(
				:item="item",
				v-for="item in screen.screenWidgets",
				:getRefLineParams="getRefLineParams",
				:ref="item.id")
			dr-more(v-show="screen.chooseWidgetArray&&screen.chooseWidgetArray.length")
			.d-editor-line(data-top="0px", data-left="0px")
			.d-editor-line(:data-top="`${screen.height}px`", data-left="0px")
			.d-editor-line(
				data-top="0px",
				:style="{ width: 0, height: `${screen.height}px` }",
				:data-left="`${screen.width}px`")
			.d-editor-line(
				data-top="0px",
				data-left="0px",
				:style="{ height: `${screen.height}px`, width: 0 }")
			// 参考线
			span.ref-line.v-line.pos-a(
				v-for="item in vLine",
				v-show="item.display",
				:style="{ left: item.position, top: item.origin, height: item.lineLength }")
			span.ref-line.h-line.pos-a(
				v-for="item in hLine",
				v-show="item.display",
				:style="{ top: item.position, left: item.origin, width: item.lineLength }")
	d-guide
	right-menu
	d-footer
</template>
<script lang="ts">
import rightMenu from '../right-menu/index.vue'
import dRuler from '../d-ruler/index.vue'
import drMore from '../../components/d-dr-more/index.vue'
import widgetOperation from './widget-operation'
import dRightManage from '@/components-right/d-right-manage/index.vue'
import dFooter from '../d-footer/index.vue'
import dGuide from '../d-guide/index.vue'
import instance from '../../store/instance.store'
import ItemCard from './item-card.vue'
import Ruler from '@/controller/Ruler'
import { Component, Provide } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'

@Component({
	components: {
		ItemCard,
		dRuler,
		dFooter,
		dGuide,
		drMore,
		dRightManage,
		rightMenu,
	},
})
export default class DEditor extends mixins(widgetOperation) {
	ruler = {}
	screen: ScreenV = {}
	vLine = []
	hLine = []
	@Provide() kanboardEditor = this

	get canvasStyle() {
		return {
			width: `${this.screen.width}px`,
			height: `${this.screen.height}px`,
			'background-color': this.screen.backgroundColor,
			'background-image': `url(${this.screen.backgroundImage})`,
		}
	}
	get canvasSize() {
		const { width, height } = this.screen
		return { width, height }
	}
	getRefLineParams(params, item) {
		const { vLine, hLine } = params
		this.vLine = vLine.map(child => {
			child.w = item.config.layout.size.width
			child.h = item.config.layout.size.height
			return child
		})
		this.hLine = hLine.map(child => {
			child.w = item.config.layout.size.width
			child.h = item.config.layout.size.height
			return child
		})
	}
	showRightMenu(e, item) {
		e.preventDefault()
		this.handleActivated(this.screen.screenWidgets[item.id])
		const rightMenu = document.getElementById('right-menu')
		rightMenu.classList.add('active')
		if (e.clientY + rightMenu.scrollHeight > window.innerHeight) {
			rightMenu.style.top = e.clientY - rightMenu.scrollHeight + 'px'
		} else {
			rightMenu.style.top = e.clientY + 'px'
		}
		rightMenu.style.left = e.clientX + 'px'
	}
	drop(e) {
		const widgetConfig = e.dataTransfer.getData('widget-config')
		if (widgetConfig) {
			this.handleWidgetDrop(e, widgetConfig)
		}
	}
	beforeDestroy() {
		this.screen.fullscreen = false
	}
	created() {
		this.ruler = Ruler.getInstance()
	}
	mounted() {
		this.screen = this.$screen
		instance.actions.setInstance('kanboard', this)
		this.screen.setStatus('inEdit')
	}
}
</script>
<style lang="scss">
@import 'index.scss';
</style>
<style lang="scss" scoped>
.ref-line {
	background-color: var(--lineRed);
}

.v-line {
	width: 1px;
	height: 100%;
}

.h-line {
	width: 100%;
	height: 1px;
}

.d-editor {
	background-color: #313239;
	transition: all 0.3s;

	&.fullscreen {
		position: fixed !important;
		top: 0 !important;
		right: 0 !important;
		bottom: 0 !important;
		left: 0 !important;
		box-sizing: border-box !important;
		width: 100% !important;
		min-width: 0 !important;
		max-width: none !important;
		height: 100% !important;
		min-height: 0 !important;
		max-height: none !important;
		margin: 0 !important;
		transform: none !important;
		object-fit: contain;
	}
}

#screen {
	background-size: contain;
	box-shadow: rgba(0, 0, 0, 0.5) 0 0 30px 0;
	transition: background-image 0.5s;

	&::before {
		display: flex;
		content: '';
	}
}
</style>
