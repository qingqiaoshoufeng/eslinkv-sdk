import platform from '../../store/platform.store'
import event from '../../store/event.store'
import ruler from '../../store/ruler.store'
import { throttle } from 'throttle-debounce'

export default {
	data() {
		return {
			clientX: 0, // 当前鼠标位置，用于标尺上的红线
			clientY: 0,
			platform: platform.state,
			event: event.state,
			ruler: ruler.state,
			contentWidth: 0,
			contentHeight: 0,
		}
	},
	watch: {
		'platform.panelConfig.size': {
			deep: true,
			handler() {
				ruler.actions.resetZoom()
			},
		},
	},
	methods: {
		windowResize() {
			const id = this.ruler.dragId
			const dragContent = document.getElementById(id)
			this.contentWidth = dragContent.firstChild.scrollWidth
			this.contentHeight = dragContent.firstChild.scrollHeight
		},
		/**
		 * @description 设置缩放比例
		 *
		 * e.wheelDeltaY 滚轮方向
		 */
		handleWheelZoom(e) {
			if (e.wheelDelta > 0) {
				ruler.actions.zoomIn()
			} else {
				ruler.actions.zoomOut()
			}
		},
		handleWheel(e) {
			if (e.ctrlKey) {
				e.preventDefault()
				e.stopPropagation()
				this.handleWheelZoom(e)
				return false
			}
		},
		handleDragContentWheel(e) {
			if (!e.ctrlKey) {
				e.preventDefault()
				e.stopPropagation()

				if (e.shiftKey) {
					this.ruler.contentX += e.wheelDelta > 0 ? 10 : -10
					return false
				}
				this.ruler.contentY += e.wheelDelta > 0 ? 10 : -10
			}
		},
	},
	mounted() {
		const id = this.ruler.dragId
		const dragContent = document.getElementById(id)
		window.addEventListener('resize', this.windowResize)
		document
			.getElementById('d-screen')
			.addEventListener('wheel', this.handleWheel)
		dragContent.addEventListener('wheel', this.handleDragContentWheel)
		requestAnimationFrame(this.windowResize)
		setTimeout(() => {
			ruler.actions.resetZoom()
		})
	},
	beforeDestroy() {
		const id = this.ruler.dragId
		const dragContent = document.getElementById(id)
		document
			.getElementById('d-screen')
			.removeEventListener('wheel', this.handleWheel)
		if (dragContent) {
			dragContent.removeEventListener(
				'wheel',
				this.handleDragContentWheel,
			)
		}
	},
}
