<template lang="pug">
#ruler-right-menu.right-menu.pos-f(
	@contextmenu.stop.prevent,
	v-click-outside="hideRightMenu")
	ul.list
		li(@click="handleCreateX")
			i-icon(type="md-color-wand", :style="{ transform: 'rotate(46deg)' }")
			span 插入纵参考线
		li(@click="handleCreateY")
			i-icon(type="md-color-wand", :style="{ transform: 'rotate(-46deg)' }")
			span 插入横参考线
		li(@click="resetZoom")
			i-icon(type="md-happy")
			span 画布居中
	i-modal(v-model="createModal", :closable="false", @on-ok="createGuide")
		.fn-flex.flex-row
			label(:style="{ marginRight: '10px', width: '100px' }") {{ guideType }}轴坐标值
			i-input(v-model="guide")
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Icon, Input, Modal } from 'view-design'
import Editor from '@/core/Editor'
import ClickOutside from 'vue-click-outside'

@Component({
	components: {
		'i-icon': Icon,
		'i-input': Input,
		'i-modal': Modal,
	},
	directives: { ClickOutside },
})
export default class rightMenu extends Vue {
	editor: Editor = Editor.Instance()
	guide = ''
	guideType = ''
	createModal = false

	createGuide(): void {
		if (isNaN(Number(this.guide))) this.$Message.error('请输入数字')
		this.editor.createGuide(this.guide, this.guideType)
	}
	resetZoom(): void {
		this.editor.resetZoom()
		this.hideRightMenu()
	}
	handleCreateX(): void {
		this.createModal = true
		this.guide = ''
		this.guideType = 'x'
		this.hideRightMenu()
	}

	handleCreateY(): void {
		this.createModal = true
		this.guide = ''
		this.guideType = 'y'
		this.hideRightMenu()
	}

	hideRightMenu(): void {
		const rightMenu = document.getElementById('ruler-right-menu')
		rightMenu.classList.remove('active')
	}
}
</script>
<style lang="scss">
.right-menu {
	z-index: 2;
	width: 132px;
	font-size: 12px;
	color: #bfbfbf;
	text-align: left;
	pointer-events: none;
	background: #2d2f38;
	opacity: 0;
	transition: transform 0.2s, opacity 0.2s;
	transform: translateY(10px);

	.list {
		border-bottom: 1px solid #22242b;

		&:last-child {
			border-bottom: none;
		}

		li {
			position: relative;
			display: flex;
			align-items: center;
			height: 26px;
			padding: 0 12px 0 15px;
			cursor: pointer;

			&:hover {
				background: #393e49;
			}

			span {
				margin-left: 4px;
				user-select: none;
			}
		}
	}

	&.active {
		pointer-events: auto;
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
