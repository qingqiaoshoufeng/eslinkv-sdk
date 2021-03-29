import platform from '../../store/platform.store'
import { throttle } from 'throttle-debounce'

export default {
    data () {
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
            contentDrag: false // 是否正在执行内容区拖动
        }
    },
    methods: {
        /**
         * @description 拖动开始时
         */
        handleContentMoveStart (e) {
            if (!this.contentMove) return
            this.contentMoveStartX = e.clientX
            this.contentMoveStartY = e.clientY
            this.contentDrag = true
        },
        /**
         * @description 拖动停止时
         */
        handleContentMoveEnd () {
            if (!this.contentDrag) return
            this.contentDrag = false
            this.contentMoveStartX = this.contentMoveStartY = 0
        },
        init () {
            this.box()
        },
        windowResize () {
            this.init()
        },
        startContentMove (e) {
            if (e.keyCode === 32) this.contentMove = true
        },
        stopContentMove () {
            this.contentMove = false
        },
        box () {
            const id = this.platform.ruler.dragId
            const dragContent = document.getElementById(id)
            this.contentWidth = dragContent.firstChild.scrollWidth
            this.contentHeight = dragContent.firstChild.scrollHeight
        },
        dispatchHotKey (e) {
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
        setMove: throttle(50, false, function (e) {
            const {
                clientX,
                clientY
            } = e
            if (this.platform.panelFixed) {
                /* todo 修改尺寸 */
                this.clientX = clientX - 226
            }
            this.clientY = clientY - this.platform.ruler.panelTopDistance
            if (this.contentDrag) {
                if (!this.contentMoveStartX) {
                    this.contentMoveStartX = clientX
                    this.contentMoveStartY = clientY
                }
                this.platform.ruler.contentScrollLeft = Math.ceil(clientX - this.contentMoveStartX)
                this.platform.ruler.contentScrollTop = Math.ceil(clientY - this.contentMoveStartY)
                this.contentMoveStartX = clientX
                this.contentMoveStartY = clientY
            } else {
                this.dottedLineMove(this.clientX, this.clientY)
            }
        }),
        stopMove ($event) {
            if (this.contentDrag) {
                this.handleContentMoveEnd($event)
                return
            }
            // 虚线松开
            if (!this.platform.ruler.isDrag) return
            let {
                clientX,
                clientY
            } = $event
            if (this.platform.panelFixed) {
                /* todo 修改尺寸 */
                clientX -= 226
            }
            clientY -= this.platform.ruler.panelTopDistance
            if (!this.platform.ruler.dragGuideId || this.isMoved) {
                this.handleGuideLine()
            }
        },
        /**
         * @description 设置缩放比例
         *
         * e.wheelDeltaY 滚轮方向
         */
        handleWheelZoom (e) {
            if (+new Date() - this.zoomUpdateTime >= 500) {
                if (e.wheelDelta > 0) {
                    platform.actions.zoomIn()
                } else {
                    platform.actions.zoomOut()
                }
                this.zoomUpdateTime = +new Date()
            }
        },
        handleWheel (e) {
            e.preventDefault()
            e.stopPropagation()
            if (e.ctrlKey) {
                this.handleWheelZoom(e)
                return false
            }
            if (e.shiftKey) {
                if (+new Date() - this.scrollXTime >= 500) {
                    this.platform.ruler.contentX += e.wheelDelta > 0 ? 10 : -10
                    this.scrollXTime = +new Date()
                }
                return false
            }
            if (+new Date() - this.scrollYTime >= 500) {
                this.platform.ruler.contentY += e.wheelDelta > 0 ? 10 : -10
                this.scrollYTime = +new Date()
            }
        },
        /**
         * @description 恢复默认缩放比例+居中
         */
        resetZoom (e) {
            const id = this.platform.ruler.dragId
            const dragContent = document.getElementById(id)
            e && e.stopPropagation()
            this.platform.ruler.zoom = 1
            const {
                offsetWidth,
                offsetHeight
            } = document.body
            if (!dragContent) return
            const {
                width,
                height
            } = dragContent.getBoundingClientRect()
            const deltaX = (offsetWidth - width) * 0.5
            const deltaY = (offsetHeight - height) * 0.5
            this.platform.ruler.contentX = Math.ceil(deltaX)
            this.platform.ruler.contentY = Math.ceil(deltaY)
        }
    },
    mounted () {
        const id = this.platform.ruler.dragId
        const dragContent = document.getElementById(id)
        document.addEventListener('mousemove', this.setMove)
        document.addEventListener('mouseup', this.stopMove)
        document.addEventListener('keyup', this.dispatchHotKey, true)
        document.addEventListener('keydown', this.startContentMove)
        window.addEventListener('resize', this.windowResize)
        dragContent.addEventListener('wheel', this.handleWheel)
        dragContent.addEventListener('dblclick', this.resetZoom)
        requestAnimationFrame(this.init)

        // todo 画板居中优化
        setTimeout(() => {
            this.resetZoom()
        })
    },
    beforeDestroy () {
        const id = this.platform.ruler.dragId
        const dragContent = document.getElementById(id)
        document.removeEventListener('mousemove', this.setMove)
        document.removeEventListener('mouseup', this.stopMove)
        document.removeEventListener('keyup', this.dispatchHotKey, true)
        document.removeEventListener('keydown', this.startContentMove)
        window.removeEventListener('resize', this.windowResize)
        if (dragContent) {
            dragContent.removeEventListener('wheel', this.handleWheel)
            dragContent.removeEventListener('dblclick', this.resetZoom)
        }
    }
}
