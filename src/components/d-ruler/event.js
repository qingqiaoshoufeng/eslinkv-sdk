import platform from '../../store/platform.store'
import { throttle } from 'throttle-debounce'

export default {
	data() {
		return {
			clientX: 0, // 当前鼠标位置，用于标尺上的红线
			clientY: 0,
			platform: platform.state,
			contentWidth: 0,
			contentHeight: 0,
			contentMoveStartX: 0, // 内容容器移动起始点水平时点值
			contentMoveStartY: 0, // 内容容器移动起始点垂直时点值
			contentMove: false, // 是否按下了 空格 键，启动内容区拖动
			contentDrag: false, // 是否正在执行内容区拖动
		}
	},
	watch: {
		'platform.panelConfig.size': {
			deep: true,
			handler(val) {
				this.resetZoom()
			}
		}
	},
	methods: {
		/**
		 * @description 拖动开始时
		 */
		handleContentMoveStart(e) {
			if (!this.contentMove) return
			this.contentMoveStartX = e.clientX
			this.contentMoveStartY = e.clientY
			this.contentDrag = true
		},
		/**
		 * @description 拖动停止时
		 */
		handleContentMoveEnd() {
			if (!this.contentDrag) return
			this.contentDrag = false
			this.contentMoveStartX = this.contentMoveStartY = 0
		},
		startContentMove(e) {
			if (
				(e.ctrlKey === true || e.metaKey === true) &&
				(e.which === 189 ||
					e.which === 187 ||
					e.which === 173 ||
					e.which === 61 ||
					e.which === 107 ||
					e.which === 109)
			) {
				e.preventDefault()
			}
			if (e.keyCode === 32) this.contentMove = true
		},
		stopContentMove() {
			this.contentMove = false
		},
		windowResize() {
			const id = this.platform.ruler.dragId
			const dragContent = document.getElementById(id)
			this.contentWidth = dragContent.firstChild.scrollWidth
			this.contentHeight = dragContent.firstChild.scrollHeight
		},
		setMove: throttle(50, false, function (e) {
			const { clientX, clientY } = e
			this.clientX = clientX
			this.clientY = clientY
			if (this.contentDrag) {
				if (!this.contentMoveStartX) {
					this.contentMoveStartX = clientX
					this.contentMoveStartY = clientY
				}
				this.platform.ruler.contentScrollLeft = Math.ceil(
					clientX - this.contentMoveStartX,
				)
				this.platform.ruler.contentScrollTop = Math.ceil(
					clientY - this.contentMoveStartY,
				)
				this.contentMoveStartX = clientX
				this.contentMoveStartY = clientY
			}
		}),
		stopMove(e) {
			if (this.contentDrag) {
				this.handleContentMoveEnd(e)
			}
		},
		/**
		 * @description 设置缩放比例
		 *
		 * e.wheelDeltaY 滚轮方向
		 */
		handleWheelZoom(e) {
			if (e.wheelDelta > 0) {
				platform.actions.zoomIn()
			} else {
				platform.actions.zoomOut()
			}
		},
		handleWheelWindow(e) {
			e.preventDefault()
			e.stopPropagation()
		},
		handleWheel (e) {
			e.preventDefault()
			e.stopPropagation()
			if (e.ctrlKey) {
				this.handleWheelZoom(e)
				return false
			}
			if (e.shiftKey) {
				this.platform.ruler.contentX += e.wheelDelta > 0 ? 10 : -10
				return false
			}
			this.platform.ruler.contentY += e.wheelDelta > 0 ? 10 : -10
		},
		/**
		 * @description 恢复默认缩放比例+居中
		 */
		resetZoom(e) {
			e && e.stopPropagation()
			const rulerOffsetWidth =
				this.$refs.rulerContent.offsetWidth - this.platform.ruler.size
			const rulerOffsetHeight = this.$refs.rulerContent.offsetHeight
			const platformWidth = this.platform.panelConfig.size.width
			const platformHeight = this.platform.panelConfig.size.height
			this.platform.ruler.zoom =
				~~((rulerOffsetWidth / platformWidth) * 100) / 100 || this.platform.ruler.zoomStep
			const deltaX = (rulerOffsetWidth - platformWidth) * 0.5
			const deltaY = (rulerOffsetHeight - platformHeight) * 0.5
			this.platform.ruler.contentX = Math.ceil(deltaX)
			this.platform.ruler.contentY = Math.ceil(deltaY)
		},
	},
	mounted() {
		const id = this.platform.ruler.dragId
		const dragContent = document.getElementById(id)
		document.addEventListener('mousemove', this.setMove)
		document.addEventListener('mouseup', this.stopMove)
		document.addEventListener('keyup', this.stopContentMove)
		document.addEventListener('keydown', this.startContentMove)
		window.addEventListener('resize', this.windowResize)
		document.getElementById('app').addEventListener('wheel', this.handleWheel)
		dragContent.addEventListener('dblclick', this.resetZoom)
		requestAnimationFrame(this.windowResize)

		setTimeout(() => {
			this.resetZoom()
		})
	},
	beforeDestroy() {
		const id = this.platform.ruler.dragId
		const dragContent = document.getElementById(id)
		document.removeEventListener('mousemove', this.setMove)
		document.removeEventListener('mouseup', this.stopMove)
		document.removeEventListener('keyup', this.stopContentMove)
		document.removeEventListener('keydown', this.startContentMove)
		window.removeEventListener('resize', this.windowResize)
		document.getElementById('app').removeEventListener('wheel', this.handleWheel)
		if (dragContent) {
			dragContent.removeEventListener('dblclick', this.resetZoom)
		}
	},
}
