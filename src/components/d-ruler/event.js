import platform from '../../store/platform.store'

export default {
	data() {
		return {
			clientX: 0, // 当前鼠标位置，用于标尺上的红线
			clientY: 0,
			platform: platform.state,
			zoomUpdateTime: +new Date(),
			scrollYTime: +new Date(),
			scrollXTime: +new Date(),
			contentWidth: 0,
			contentHeight: 0,
			contentMoveStartX: 0, // 内容容器移动起始点水平时点值
			contentMoveStartY: 0, // 内容容器移动起始点垂直时点值
			contentMove: false, // 是否按下了 空格 键，启动内容区拖动
			contentDrag: false, // 是否正在执行内容区拖动
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
		/**
		 * @description 内容区拖动围栏
		 */
		contentMoveFence() {
			const rulerRange = this.platform.ruler.rulerRange
			const endX = -rulerRange
			const endY = -rulerRange
			if (this.platform.ruler.contentScrollLeft < endX) this.platform.ruler.contentScrollLeft = endX
			if (this.platform.ruler.contentScrollTop < endY) this.platform.ruler.contentScrollTop = endY
			const startX = rulerRange / 2
			const startY = rulerRange / 2
			if (this.platform.ruler.contentScrollLeft > startX) this.platform.ruler.contentScrollLeft = startX
			if (this.platform.ruler.contentScrollTop > startY) this.platform.ruler.contentScrollTop = startY
		},
		/**
		 * @description 根据缩放比例生成 x,y刻度
		 */
		scaleCalc() {
			const rulerRange = this.platform.ruler.rulerRange
			const getCalc = (array, length) => {
				const step = this.platform.ruler.stepLength / this.platform.ruler.zoom
				for (let id = 0; id < length * step / 50; id += step) {
					if (id % step === 0) {
						array.push({id})
					}
				}
			}
			const getCalcRevise = (array, length) => {
				array.splice(0)
				const step = this.platform.ruler.stepLength / this.platform.ruler.zoom
				for (let id = -length * step / 50; id < 0; id += step) {
					if (id % step === 0 && id + step <= length) {
						array.push({id})
					}
				}
			}
			getCalcRevise(this.xScale, rulerRange / 2)
			getCalcRevise(this.yScale, rulerRange / 2)
			getCalc(this.xScale, rulerRange)
			getCalc(this.yScale, rulerRange)
		},
		init() {
			this.box()
			this.setSpacing()
			this.scaleCalc()
		},
		windowResize() {
			this.xScale = []
			this.yScale = []
			this.init()
		},
		startContentMove(e) {
			if (e.keyCode === 32) this.contentMove = true
		},
		stopContentMove() {
			this.contentMove = false
		},
		box() {
			const id = this.platform.ruler.dragId
			const dragContent = document.getElementById(id)
			this.contentWidth = dragContent.firstChild.scrollWidth
			this.contentHeight = dragContent.firstChild.scrollHeight
		},
		dispatchHotKey(e) {
			this.stopContentMove()
			switch (e.keyCode) {
				case 82: // r
					if (e.altKey) {
						this.platform.ruler.rulerVisible = !this.platform.ruler.rulerVisible
					}
					break
				case 67: // c
					if (e.altKey) this.clearGuides()
					break
				case 72: // h
					if (e.altKey) this.insertGuide('h')
					break
				case 76: // l
					if (e.altKey) this.platform.ruler.lockGuides = !this.platform.ruler.lockGuides
					break
				case 86: // v
					if (e.altKey) this.insertGuide('v')
					break
			}
		},
		setMove(e) {
			const {clientX, clientY} = e
			this.clientX = clientX
			this.clientY = clientY
			if (this.contentDrag) {
				if (!this.contentMoveStartX) {
					this.contentMoveStartX = clientX
					this.contentMoveStartY = clientY
				}
				this.platform.ruler.contentScrollLeft += Math.ceil(clientX - this.contentMoveStartX)
				this.platform.ruler.contentScrollTop += Math.ceil(clientY - this.contentMoveStartY)
				this.contentMoveStartX = clientX
				this.contentMoveStartY = clientY
				return
			}
			this.dottedLineMove(clientX, clientY)
		},
		stopMove($event) {
			if (this.contentDrag) {
				this.handleContentMoveEnd($event)
				return
			}
			// 虚线松开
			if (!this.platform.ruler.isDrag) return
			const {clientX, clientY} = $event
			if (!this.isMoved) {
				return this.clickDraw(clientX, clientY)
			}
			this.dragDrawEnd(clientX, clientY)
		},
		handleWheel(e) {
			e.preventDefault()
			e.stopPropagation()
			if (e.ctrlKey) {
				/**
				 * @description 设置缩放比例
				 *
				 * e.wheelDeltaY 滚轮方向
				 */
				if (+new Date() - this.zoomUpdateTime >= 500) {
					if (e.wheelDelta > 0) {
						if (this.platform.ruler.zoom < 4)
							this.platform.ruler.zoom = (this.platform.ruler.zoom * 10 + 1) / 10
					} else {
						if (this.platform.ruler.zoom > 0.1)
							this.platform.ruler.zoom = (this.platform.ruler.zoom * 10 - 1) / 10
					}
					requestAnimationFrame(() => {
						this.scaleCalc()
					})
					this.zoomUpdateTime = +new Date()
				}
				return false
			}
			if (e.shiftKey) {
				if (+new Date() - this.scrollXTime >= 500) {
					this.platform.ruler.contentScrollLeft += e.wheelDelta > 0 ? 10 : -10
					this.contentMoveFence()
					this.scrollXTime = +new Date()
				}
				return false
			}
			if (+new Date() - this.scrollYTime >= 500) {
				this.platform.ruler.contentScrollTop += e.wheelDelta > 0 ? 10 : -10
				this.contentMoveFence()
				this.scrollYTime = +new Date()
			}
		},
		/**
		 * @description 恢复默认缩放比例+居中
		 */
		resetZoom(e) {
			const id = this.platform.ruler.dragId
			const dragContent = document.getElementById(id)
			e && e.stopPropagation()
			this.platform.ruler.zoom = 1
			const {offsetWidth, offsetHeight} = document.body
			if (!dragContent) return
			const {width, height} = dragContent.getBoundingClientRect()
			const deltaX = (offsetWidth - width) * 0.5
			const deltaY = (offsetHeight - height) * 0.5
			this.platform.ruler.contentScrollLeft = Math.ceil(deltaX)
			this.platform.ruler.contentScrollTop = Math.ceil(deltaY)
		},
	},
	mounted() {
		const id = this.platform.ruler.dragId
		const dragContent = document.getElementById(id)
		document.addEventListener('mousemove', this.setMove)
		document.addEventListener('mouseup', this.stopMove)
		document.addEventListener('keyup', this.dispatchHotKey, true)
		document.addEventListener('keydown', this.startContentMove)
		window.addEventListener('resize', this.windowResize)
		window.addEventListener('scroll', this.setSpacing)
		dragContent.addEventListener('wheel', this.handleWheel)
		dragContent.addEventListener('dblclick', this.resetZoom)
		requestAnimationFrame(this.init)
		setTimeout(() => {
			this.resetZoom()
		})
	},
	beforeDestroy() {
		const id = this.platform.ruler.dragId
		const dragContent = document.getElementById(id)
		document.removeEventListener('mousemove', this.setMove)
		document.removeEventListener('mouseup', this.stopMove)
		document.removeEventListener('keyup', this.dispatchHotKey, true)
		document.removeEventListener('keydown', this.startContentMove)
		window.removeEventListener('resize', this.windowResize)
		window.removeEventListener('scroll', this.setSpacing)
		dragContent.removeEventListener('wheel', this.handleWheel)
		dragContent.removeEventListener('dblclick', this.resetZoom)
	}
}
