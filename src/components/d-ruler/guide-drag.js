import platform from '../../store/platform.store'

export default {
	data () {
		return {
			guideStep: 5,
			platform: platform.state,
			isMoved: false,
			horizontalDottedLeft: -999, // 水平虚线位置
			verticalDottedTop: -999 // 垂直虚线位置
		}
	},
	methods: {
		guideStepFence (value) {
			const step = this.guideStep
			const halfStep = step / 2
			const remaining = value % step
			if (remaining === 0) return Math.ceil(value)
			return Math.ceil(remaining < halfStep ? value - remaining : value + step - remaining)
		},
		setGuidePosition (clientX, clientY) {
			switch (this.platform.ruler.dragFlag) {
				case 'x':
					this.verticalDottedTop = this.guideStepFence(clientY) - 2
					break
				case 'y':
					this.horizontalDottedLeft = this.guideStepFence(clientX) - 2
					break
				case 'h':
					this.verticalDottedTop = this.guideStepFence(clientY)
					break
				case 'v':
					this.horizontalDottedLeft = this.guideStepFence(clientX)
					break
				default:
					break
			}
		},
		dottedLineMove (clientX, clientY) {
			if (!this.platform.ruler.isDrag) return
			this.isMoved = true
			this.setGuidePosition(clientX, clientY)
		},
		insertGuide (type) {
			const sites = window.prompt(`请输入${type === 'h' ? '水平' : '垂直'}参考线坐标，插入多个参考线使用半角逗号分隔`, '')
			if (!sites) return
			this.platform.ruler.dragFlag = type
			sites.split(',').forEach(site => {
				platform.actions.guideAdd(site)
			})
		},
		clearGuides () {
			if (window.confirm('您确定要清空参考线？')) {
				this.platform.ruler.guideLines = []
			}
		}
	}
}
