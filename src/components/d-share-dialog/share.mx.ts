import { copyText } from '../../utils/index'
import platform from '../../store/platform.store.js'

function fixZero(n) {
	if (n > 9) {
		return n
	}
	return `0${n}`
}

function formatTime(time) {
	const newTime = new Date(time)
	const YY = newTime.getFullYear()
	const MM = fixZero(newTime.getMonth() + 1)
	const DD = fixZero(newTime.getDate())
	const hh = fixZero(newTime.getHours())
	const mm = fixZero(newTime.getMinutes())
	const ss = fixZero(newTime.getSeconds())
	return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`
}

export default {
	data() {
		return {
			platform: platform.state,
			deadline: '',
			shareModal: false,
			shareType: 'NO',
			shareUrl: '',
			shareTime: 1,
			sharePassword: Math.random().toString(36).replace('0.', ''),
		}
	},
	methods: {
		keypressForTime(event) {
			const keyCode = event.keyCode
			event.returnValue = keyCode >= 48 && keyCode <= 57
		},
		handleCopy() {
			copyText(this.shareUrl)
		},
		async closeShare() {
			await this.$api.screenShare.screenShareUpdate({
				screenId: this.screenId,
				screenShareType: 'NO',
			})
			this.shareUrl = ''
			this.shareType = 'NO'
		},
		async shareSubmit(shareType) {
			this.shareType = shareType
			const req: any = {
				screenId: this.screenId,
				screenShareType: shareType,
			}
			if (this.shareType === 'PASSWORD') {
				req.screenSharePassword = this.sharePassword
			}
			if (this.shareType === 'TIME') {
				const now = new Date()
				const newTime = new Date(
					now.getTime() + this.shareTime * 60 * 60 * 1000,
				)
				req.screenShareTime = formatTime(newTime)
				this.deadline = req.screenShareTime
			}
			await this.$api.screenShare.screenShareUpdate(req)
			this.shareUrl = `${location.origin}/shareScreen/${this.screenId}?layoutMode=${this.platform.panelConfig.size.layoutMode}`
		},
		async init() {
			this.screenId = this.sid || this.$route.params.id
			const res = await this.$api.screenShare.screenShareDetail({
				screenId: this.screenId,
			})
			this.shareType = res.screenShareType
			this.sharePassword = res.screenSharePassword || this.sharePassword
			this.platform.ruler.guideLines = res.screenGuide
			if (res.screenShareTime) {
				this.shareTime = (
					(new Date(res.screenShareTime).getTime() -
						new Date().getTime()) /
					3600000
				).toFixed(2)
				this.deadline = formatTime(res.screenShareTime)
			}
			if (res.screenShareType !== 'NO') {
				this.shareUrl = `${location.origin}/shareScreen/${this.screenId}?layoutMode=${this.platform.panelConfig.size.layoutMode}`
			}
		},
	},
	created() {
		if (this.autoInit) {
			this.init()
		}
	},
}
