<template lang="pug">
// 操作区
#d-editor.d-editor.pos-r(
	ref="canvas-wrapper",
	:class="{ fullscreen: editor.fullscreen }",
	:style="{ width: `calc(100% - ${editor.xRoomL1 + editor.xRoomL2 + editor.xRoomR1}px)`, marginLeft: `${editor.xRoomL1 + editor.xRoomL2}px` }",
	@contextmenu.stop.prevent)
	// 标尺容器
	d-ruler(ref="rulerCanvas")
		// 大屏
		#screen.pos-r(
			:style="canvasStyle",
			@drop="createWidget",
			@click.stop,
			@dragover.prevent)
			// 小工具清单
			item-card(
				:item="item",
				:key="item.id",
				v-for="item in editor.showWidgets",
				:getRefLineParams="getRefLineParams",
				:ref="item.id")
			dr-more(v-show="editor.currentWidgetList&&editor.currentWidgetList.length")
			.d-editor-line(data-top="0px", data-left="0px")
			.d-editor-line(:data-top="`${editor.height}px`", data-left="0px")
			.d-editor-line(
				data-top="0px",
				:style="{ width: 0, height: `${editor.height}px` }",
				:data-left="`${editor.width}px`")
			.d-editor-line(
				data-top="0px",
				data-left="0px",
				:style="{ height: `${editor.height}px`, width: 0 }")
			// 参考线
			span.ref-line.v-line.pos-a(
				v-for="item in vLine",
				v-show="item.display",
				:style="{ left: item.position, top: item.origin, height: item.lineLength }")
			span.ref-line.h-line.pos-a(
				v-for="item in hLine",
				v-show="item.display",
				:style="{ top: item.position, left: item.origin, width: item.lineLength }")
	right-menu
	d-footer
</template>
<script lang="ts">
import rightMenu from '../right-menu/index.vue'
import dRuler from '../d-ruler/index.vue'
import drMore from '../../components/d-dr-more/index.vue'
import dFooter from '../d-footer/index.vue'
import instance from '../../store/instance.store'
import ItemCard from './item-card.vue'
import { Component, Vue } from 'vue-property-decorator'
import Editor from '@/core/Editor'

@Component({
	components: {
		ItemCard,
		dRuler,
		dFooter,
		drMore,
		rightMenu,
	},
})
export default class DEditor extends Vue {
	editor: Editor = Editor.Instance()
	vLine = []
	hLine = []
	get canvasStyle(): any {
		if (this.editor) {
			return {
				width: `${this.editor.width}px`,
				height: `${this.editor.height}px`,
				'background-color': this.editor.backgroundColor,
				'background-image': `url(${this.editor.backgroundImage})`,
			}
		}
		return {}
	}

	createWidget(e: any): void {
		const widgetConfig = e.dataTransfer.getData('widget-config')
		if (widgetConfig) {
			this.editor.createWidget(
				e.offsetX,
				e.offsetY,
				JSON.parse(widgetConfig),
			)
		}
	}

	getRefLineParams(params: any, item: any): void {
		const { vLine, hLine } = params
		this.vLine = vLine.map((child: any) => {
			child.w = item.config.layout.size.width
			child.h = item.config.layout.size.height
			return child
		})
		this.hLine = hLine.map((child: any) => {
			child.w = item.config.layout.size.width
			child.h = item.config.layout.size.height
			return child
		})
	}
	fullscreenchange(): void {
		this.editor.fullscreen = !this.editor.fullscreen
	}
	beforeDestroy(): void {
		this.editor.fullscreen = false
		document.removeEventListener('fullscreenchange', this.fullscreenchange)
	}
	mounted(): void {
		this.editor.updateEditorStatus('inEdit')
		document.addEventListener('fullscreenchange', this.fullscreenchange)
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
