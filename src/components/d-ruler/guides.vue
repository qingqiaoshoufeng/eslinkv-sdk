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
			contentHeight: Number
		},
		data () {
			return {
				showGuideMenu: false,
				menuLeft: 0,
				menuTop: 0,
				removeId: null,
				platform: platform.state
			}
		},
		computed: {
			guidesWrapperStyle () {
				const style = []
				style.push(`width: ${this.contentWidth}px`)
				style.push(`height: ${this.contentHeight}px`)
				style.push(`transform: translate3d(${this.platform.ruler.contentX}px, ${this.platform.ruler.contentY}px, 0) scale(${this.platform.ruler.zoom})`)
				return style.join(';')
			}
		},
		methods: {
			// 水平线/垂直线 处按下鼠标
			handleGuideDrag (e, item) {
				if (e.which !== 1) return
				let { clientX, clientY } = e
				const { type, id } = item
				if (this.platform.panelFixed) {
					clientX -= 428
				}
				this.platform.ruler.guideDragStartX = clientX
				this.platform.ruler.guideDragStartY = clientY
				this.platform.ruler.isDrag = true
				this.platform.ruler.dragFlag = type
				this.platform.ruler.dragGuideId = id
			},
			handleDestroy (id) {
				const index = this.platform.ruler.guideLines.findIndex(v => v.id === id)
				this.platform.ruler.guideLines.splice(index, 1)
			},
			getLineStyle ({ type, site }) {
				const style = {}
				type === 'h' && (style.top = `${site}px`)
				type === 'v' && (style.left = `${site}px`)
				site < 0 && (style.opacity = '0')
				style.transform = `scale(${type === 'v' ? 1 / this.platform.ruler.zoom + ', 1' : '1, ' + 1 / this.platform.ruler.zoom})`
				return style
			},
			openGuideMenu (id, e) {
				e.preventDefault()
				e.stopPropagation()
				this.removeId = id
				this.showGuideMenu = true
				this.menuLeft = e.clientX
				this.menuTop = e.clientY
			},
			closeGuideMenu () {
				this.showGuideMenu = false
			}
		},
		mounted () {
			document.addEventListener('click', this.closeGuideMenu)
		},
		beforeDestroy () {
			document.removeEventListener('click', this.closeGuideMenu)
		}
	}
</script>
<style lang="scss" scoped>
	.guides-wrapper {
		top: 18px;
		left: 18px;
		z-index: 3;
		overflow: visible;
		pointer-events: none;
		transition: transform 0.3s;
	}

	.vue-ruler-ref-line-v,
	.vue-ruler-ref-line-h,
	.vue-ruler-ref-dot-h,
	.vue-ruler-ref-dot-v {
		top: 0;
		left: 0;
		pointer-events: auto;
	}

	.vue-ruler-ref-line-v,
	.vue-ruler-ref-line-h {
		background-color: cyan;
		opacity: 0.5;
		transform-origin: left top;

		&:hover {
			z-index: 2;
			opacity: 1;
			transform: translateX(0) scale(1, 1) !important;
		}

		&::before,
		&::after {
			position: absolute;
			content: '';
			background-color: rgba(0, 255, 255, 0.295);
		}

		&::after {
			width: 100%;
			height: 3px;
		}
	}

	.vue-ruler-ref-dot-h,
	.vue-ruler-ref-dot-v {
		z-index: 3;
	}

	.vue-ruler-ref-line-h {
		left: -9999px;
		width: 10000%;
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

	.vue-ruler-ref-line-v {
		top: -9999px;
		width: 1px;
		height: 10000%;
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

	.vue-ruler-ref-dot-h {
		top: 0;
		width: 100%;
		height: 0;
		cursor: n-resize;
		border-top: grey 1px dotted;
	}

	.vue-ruler-ref-dot-v {
		left: 0;
		width: 0;
		height: 100%;
		border-left: grey 1px dotted;
	}

	.guide-right-menu {
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

	.locked {
		opacity: 0.1;
	}

	.no-pointer {
		pointer-events: none;
	}
</style>
