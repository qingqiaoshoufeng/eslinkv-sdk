<template lang="pug">
	section(v-show="platform.ruler.rulerVisible")
		.vue-ruler-ref-dot-h.pos-a(:style="{ transform: `translateY(${vGuideTop}px)` }")
		.vue-ruler-ref-dot-v.pos-a(:style="{ transform: `translateX(${hGuideLeft}px)` }")
		.guides-wrapper.pos-a(:style="guidesWrapperStyle")
			.guide-line.z-index-9.pos-a(
				v-for="item in platform.ruler.guideLines"
				:title="item.title" :style="{...getLineStyle(item)}"
				:key="item.id"
				:class="[`vue-ruler-ref-line-${item.type}`, { locked: platform.ruler.lockGuides, 'no-pointer': platform.ruler.zoom !== 1 || contentMove || platform.ruler.lockGuides }]"
				@mousedown="e=>handleGuideDrag(e,item)"
				@contextmenu="openGuideMenu(item.id, $event)"
			)
		ul.guide-right-menu(v-show="showGuideMenu" :style="`left: ${menuLeft}px; top:${menuTop - 10}px`")
			li(@click="handleDestroy(removeId)") 删除
</template>
<script>
	import platform from '../../store/platform.store'

	export default {
		name: 'guide',
		props: {
			vGuideTop: Number,
			hGuideLeft: Number,
			contentMove: Boolean,
			contentWidth: Number,
			contentHeight: Number,
		},
		data() {
			return {
				showGuideMenu: false,
				menuLeft: 0,
				menuTop: 0,
				removeId: null,
				platform: platform.state,
			}
		},
		computed: {
			guidesWrapperStyle() {
				const style = []
				style.push(`width: ${this.contentWidth}px`)
				style.push(`height: ${this.contentHeight}px`)
				style.push(`transform: translate3d(${this.platform.ruler.contentScrollLeft}px, ${this.platform.ruler.contentScrollTop}px, 0) scale(${this.platform.ruler.zoom})`)
				return style.join(';')
			},
		},
		methods: {
			// 水平线/垂直线 处按下鼠标
			handleGuideDrag(e, item) {
				if (e.which !== 1) return
				const {type, id} = item
				this.platform.ruler.guideDragStartX = e.clientX
				this.platform.ruler.guideDragStartY = e.clientY
				this.platform.ruler.isDrag = true
				this.platform.ruler.dragFlag = type
				this.platform.ruler.dragGuideId = id
			},
			handleDestroy(id) {
				const index = this.platform.ruler.guideLines.findIndex(v => v.id === id)
				this.platform.ruler.guideLines.splice(index, 1)
			},
			getLineStyle({type, site}) {
				const style = {}
				type === 'h' && (style.top = `${site}px`)
				type === 'v' && (style.left = `${site}px`)
				site < 0 && (style.opacity = '0')
				style.transform = `scale(${type === 'v' ? 1 / this.platform.ruler.zoom + ', 1' : '1, ' + 1 / this.platform.ruler.zoom})`
				return style
			},
			openGuideMenu(id, e) {
				e.preventDefault()
				e.stopPropagation()
				this.removeId = id
				this.showGuideMenu = true
				this.menuLeft = e.clientX
				this.menuTop = e.clientY
			},
			closeGuideMenu() {
				this.showGuideMenu = false
			}
		},
		mounted() {
			document.addEventListener('click', this.closeGuideMenu)
		},
		beforeDestroy() {
			document.removeEventListener('click', this.closeGuideMenu)
		}
	}
</script>
<style lang="scss" scoped>
	.guides-wrapper {
		top: 18px;
		left: 18px;
		z-index: 3;
		pointer-events: none;
		overflow: visible;
		transition: transform .3s;
	}

	.vue-ruler-ref-line-v,
	.vue-ruler-ref-line-h,
	.vue-ruler-ref-dot-h,
	.vue-ruler-ref-dot-v {
		left: 0;
		top: 0;
		pointer-events: auto;
	}

	.vue-ruler-ref-line-v,
	.vue-ruler-ref-line-h {
		transform-origin: left top;
		opacity: 0.5;

		&:hover {
			z-index: 2;
			opacity: 1;
		}

		&:before,
		&:after {
			position: absolute;
			background-color: rgba(0, 255, 255, 0.295);
			content: '';
		}
	}

	.vue-ruler-ref-dot-h,
	.vue-ruler-ref-dot-v {
		z-index: 3;
	}

	.vue-ruler-ref-line-h {
		width: 10000%;
		height: 1px;
		left: -9999px;
		background-color: cyan;
		cursor: row-resize;

		&:hover {
			transform: translateY(0) scale(1, 1) !important;

			&:before {
				width: 100%;
				height: 3px;
				bottom: 1px;
			}

			&:after {
				width: 100%;
				height: 3px;
				top: 1px;
			}
		}
	}

	.vue-ruler-ref-line-v {
		width: 1px;
		height: 10000%;
		top: -9999px;
		background-color: cyan;
		cursor: col-resize;

		&:hover {
			transform: translateX(0) scale(1, 1) !important;

			&:before {
				width: 3px;
				height: 100%;
				right: 1px;
			}

			&:after {
				width: 3px;
				height: 100%;
				left: 1px;
			}
		}
	}

	.vue-ruler-ref-dot-h {
		width: 100%;
		height: 0;
		cursor: n-resize;
		border-top: grey 1px dotted;
		top: 0;
	}

	.vue-ruler-ref-dot-v {
		width: 0;
		height: 100%;
		border-left: grey 1px dotted;
		left: 0;
	}

	.guide-right-menu {
		position: fixed;
		width: auto;
		background-color: #fff;
		font-size: 12px;
		text-align: left;
		z-index: 900;
		transform: translateX(-100%);

		li {
			list-style: none;
			line-height: 20px;
			padding: 0 15px;
			cursor: pointer;
		}

		li:hover {
			background-color: #dcdcdc;
		}
	}

	.locked {
		opacity: 0.1;
	}

	.no-pointer {
		pointer-events: none;
	}
</style>
