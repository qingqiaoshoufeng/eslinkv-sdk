<template lang="pug">
.d-guide
	.d-guide-wrapper.pos-a(:style="guideStyle")
		.d-guide-line.z-index-9.pos-a(
			v-for="item in platform.ruler.guideLines",
			:style="{ ...lineStyle(item) }",
			:key="item.id",
			:class="[`d-guide-line-${item.type}`, { 'no-pointer': platform.ruler.contentMove || hideCursor }]",
			@mousedown.stop="e => handleGuideDrag(e, item)",
			@mousemove="handleMousemove",
			@contextmenu="openGuideMenu(item.id, $event)")
			.num.pos-a {{ item.title }}
	ul.d-guide-right-menu(
		v-show="showGuideMenu",
		:style="`left: ${menuLeft}px; top:${menuTop - 10}px`")
		li(@click="handleDestroy(removeId)") 删除
</template>
<script>
import platform from '../../store/platform.store'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class Guide extends Vue {
	showGuideMenu = false
	menuLeft = 0
	menuTop = 0
	removeId = null
	platform = platform.state
	hideCursor = false

	handleMousemove(e) {
		this.hideCursor = e.offsetX + e.offsetY > this.platform.ruler.size
	}

	/**
	 * @description
	 *
	 * 0点距离左侧边界像素值 < 0 ? 0 : 0点距离左侧边界像素值 + 标尺宽度 ===> 参考线容器偏移量
	 */
	get guideStyle() {
		return {
			left: `${
				this.platform.ruler.guideStartX < 0
					? 0
					: this.platform.ruler.guideStartX + this.platform.ruler.size
			}px`,
			top: `${
				this.platform.ruler.guideStartY < 0
					? 0
					: this.platform.ruler.guideStartY + this.platform.ruler.size
			}px`,
		}
	}

	// 水平线/垂直线 处按下鼠标
	handleGuideDrag(e, item) {
		if (e.which !== 1) return
		if (e.offsetX + e.offsetY > this.platform.ruler.size) return
		const { clientX, clientY } = e
		const { type, id } = item
		this.platform.ruler.guideDragStartX = clientX
		this.platform.ruler.guideDragStartY =
			clientY - this.platform.ruler.yRoom
		this.platform.ruler.guideDrag = true
		this.platform.ruler.dragFlag = type
		this.platform.ruler.dragGuideId = id
	}

	handleDestroy(id) {
		const index = this.platform.ruler.guideLines.findIndex(v => v.id === id)
		this.platform.ruler.guideLines.splice(index, 1)
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
				this.platform.ruler.guideStartY < 0
					? site * this.platform.ruler.zoom +
					  this.platform.ruler.guideStartY +
					  this.platform.ruler.size
					: site * this.platform.ruler.zoom
			}px`
			style.left = `-${
				this.platform.ruler.guideStartX < 0
					? 0
					: this.platform.ruler.guideStartX + this.platform.ruler.size
			}px`
		}
		if (type === 'v') {
			style.left = `${
				this.platform.ruler.guideStartX < 0
					? site * this.platform.ruler.zoom +
					  this.platform.ruler.guideStartX +
					  this.platform.ruler.size
					: site * this.platform.ruler.zoom
			}px`
			style.top = `-${
				this.platform.ruler.guideStartY < 0
					? 0
					: this.platform.ruler.guideStartY + this.platform.ruler.size
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
		this.$Modal.confirm({
			title: '确定是否清空参考线？',
			okText: '确定',
			cancelText: '取消',
			onOk: () => {
				this.platform.ruler.guideLines = []
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
@import 'src/scss/conf';

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
		color: #fff;
		background: $lineColor;
		user-select: none;
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
	background-color: $lineColor;
	opacity: 1;
	transform-origin: left top;
}

.d-guide-line-h {
	left: 0;
	width: 100%;
	height: 1px;
	cursor: row-resize;

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
	width: 1px;
	height: 100%;
	cursor: col-resize;

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
	background-color: #fff;
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
