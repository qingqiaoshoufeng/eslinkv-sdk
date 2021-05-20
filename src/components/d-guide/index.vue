<template lang="pug">
.d-guide
	.d-guide-wrapper.pos-a(:style="guideStyle")
		.d-guide-line.z-index-9.pos-a.d-editor-line(
			v-for="item in ruler.guideLines",
			:style="{ ...lineStyle(item) }",
			:data-top="item.type === 'v' ? 0 : item.site",
			:data-left="item.type === 'v' ? item.site : 0",
			:key="item.site",
			:class="[`d-guide-line-${item.type}`]",
			@mousedown="rulerGuideMouseDown($event, item)",
			@contextmenu="openGuideMenu(item.id, $event)")
			.num.pos-a {{ item.site }}px
	ul.d-guide-right-menu(
		v-show="showGuideMenu",
		:style="`left: ${menuLeft}px; top:${menuTop - 10}px`")
		li(@click="handleDestroy(removeId)") 删除
</template>
<script>
import platform from '../../store/platform.store'
import event from '../../store/event.store'
import ruler from '../../store/ruler.store'
import { Component, Vue } from 'vue-property-decorator'
import { rulerGuideMouseDown } from '@/events'
@Component
export default class Guide extends Vue {
	showGuideMenu = false
	menuLeft = 0
	menuTop = 0
	removeId = null
	platform = platform.state
	event = event.state
	ruler = ruler.state
	rulerGuideMouseDown = rulerGuideMouseDown

	/**
	 * @description
	 *
	 * 0点距离左侧边界像素值 < 0 ? 0 : 0点距离左侧边界像素值 + 标尺宽度 ===> 参考线容器偏移量
	 */
	get guideStyle() {
		return {
			left: `${
				this.ruler.guideStartX < 0
					? 0
					: this.ruler.guideStartX + this.ruler.size
			}px`,
			top: `${
				this.ruler.guideStartY < 0
					? 0
					: this.ruler.guideStartY + this.ruler.size
			}px`,
		}
	}

	updateHandle() {
		// START_PROD
		const id = this.$route.params.id
		if (id) {
			this.$api.screenShare.screenShareUpdate({
				screenId: id,
				screenGuide: this.ruler.guideLines,
			})
		}
		// END_PROD
	}

	handleDestroy(id) {
		const index = this.ruler.guideLines.findIndex(v => v.id === id)
		this.ruler.guideLines.splice(index, 1)
		this.updateHandle()
	}

	/**
	 * @description
	 *
	 * 0点距离左侧边界像素值 < 0 ? 显示像素 * 缩放比例 + 0点距离左侧边界像素值 + 标尺宽度 : 显示像素 * 缩放比例 ===> 实际像素
	 *
	 * -参考线容器偏移量 ===> -参考线容器偏移量
	 */
	lineStyle({ type, site }) {
		const style = {}
		if (type === 'h') {
			style.top = `${
				this.ruler.guideStartY < 0
					? site * this.ruler.zoom +
					  this.ruler.guideStartY +
					  this.ruler.size
					: site * this.ruler.zoom
			}px`
			style.left = `-${
				this.ruler.guideStartX < 0
					? 0
					: this.ruler.guideStartX + this.ruler.size
			}px`
		}
		if (type === 'v') {
			style.left = `${
				this.ruler.guideStartX < 0
					? site * this.ruler.zoom +
					  this.ruler.guideStartX +
					  this.ruler.size
					: site * this.ruler.zoom
			}px`
			style.top = `-${
				this.ruler.guideStartY < 0
					? 0
					: this.ruler.guideStartY + this.ruler.size
			}px`
		}
		return style
	}

	openGuideMenu(id, e) {
		e.preventDefault()
		e.stopPropagation()
		this.removeId = id
		this.showGuideMenu = true
		this.menuLeft = e.clientX
		this.menuTop = e.clientY
	}

	closeGuideMenu() {
		this.showGuideMenu = false
	}

	dispatchHotKey(e) {
		switch (e.keyCode) {
			case 67: // c
				if (e.altKey) this.clearGuides()
				break
		}
	}

	clearGuides() {
		if (this.ruler.guideLines.length > 0)
			this.$Modal.confirm({
				title: '确定是否清空参考线？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.ruler.guideLines = []
					this.updateHandle()
				},
			})
	}

	mounted() {
		document.addEventListener('keyup', this.dispatchHotKey)
		document.addEventListener('click', this.closeGuideMenu)
	}

	beforeDestroy() {
		document.removeEventListener('keyup', this.dispatchHotKey)
		document.removeEventListener('click', this.closeGuideMenu)
	}
}
</script>
<style lang="scss" scoped>
.d-guide-wrapper {
	top: 18px;
	left: 18px;
	z-index: 10;
	width: 100%;
	height: 100%;
	overflow: visible;
	pointer-events: none;
	transition: transform 0.3s;
}

.d-guide-line {
	.num {
		top: 2px;
		left: 3px;
		padding: 4px;
		font-size: 12px;
		line-height: 12px;
		color: var(--white);
		user-select: none;
		background: var(--lineRed);
	}
}

.d-guide-line-v,
.d-guide-line-h {
	top: 0;
	left: 0;
	pointer-events: auto;
}

.d-guide-line-v,
.d-guide-line-h {
	opacity: 1;
	transform-origin: left top;
}

.d-guide-line-h {
	left: 0;
	width: 100%;
	height: 0;
	cursor: row-resize;
	border-top: 1px solid var(--lineRed);

	&:hover {
		&::before {
			bottom: 1px;
			width: 100%;
			height: 3px;
		}

		&::after {
			top: 1px;
		}
	}
}

.d-guide-line-v {
	top: 0;
	width: 0;
	height: 100%;
	cursor: col-resize;
	border-left: 1px solid var(--lineRed);

	&:hover {
		&::before {
			right: 1px;
			width: 3px;
			height: 100%;
		}

		&::after {
			left: 1px;
			width: 3px;
			height: 100%;
		}
	}
}

.d-guide-right-menu {
	position: fixed;
	z-index: 900;
	width: auto;
	font-size: 12px;
	text-align: left;
	background-color: var(--white);
	transform: translateX(-100%);

	li {
		padding: 0 15px;
		line-height: 20px;
		list-style: none;
		cursor: pointer;
	}

	li:hover {
		background-color: #dcdcdc;
	}
}

.no-pointer {
	cursor: auto;
}
</style>
