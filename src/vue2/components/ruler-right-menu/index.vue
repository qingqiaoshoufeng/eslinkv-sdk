<template lang="pug">
#ruler-right-menu.right-menu.pos-f(
	@contextmenu.stop.prevent,
	v-click-outside="hideRightMenu")
	ul.list
		li(@click="handleZIndexTop")
			i-icon(type="md-arrow-round-up")
			span 插入横参考线
		li(@click="handleZIndexBottom")
			i-icon(type="md-arrow-round-down")
			span 插入纵参考线
		li(@click="editor.resetZoom")
			i-icon(type="md-arrow-round-down")
			span 画布居中
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Icon } from 'view-design'
import Editor from '@/core/Editor'
import ClickOutside from 'vue-click-outside'

@Component({
	components: {
		'i-icon': Icon,
	},
	directives: { ClickOutside },
})
export default class rightMenu extends Vue {
	editor: Editor = Editor.Instance()

	handleZIndexTop(): void {
		this.editor.currentWidget.config.layout.zIndex = this.editor.currentMaxZIndex
		this.hideRightMenu()
	}

	handleZIndexBottom(): void {
		this.editor.currentWidget.config.layout.zIndex = this.editor.currentMinZIndex
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
