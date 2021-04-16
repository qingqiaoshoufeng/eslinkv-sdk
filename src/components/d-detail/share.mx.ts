import { copyText } from '../../utils/index'

function fixZero (n) {
	if (n > 9) {
		return n
	}
	return `0${n}`
}

function formatTime (time) {
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
			deadline: '',
			shareModal: false,
			shareType: 'ALL',
			shareUrl: '',
			shareTime: 1,
			sharePassword: Math.random().toString(36).replace('0.', ''),
		}
	},
	methods: {
		handleShare() {
			this.shareModal = true
		},
		handleCopy() {
			copyText(this.shareUrl)
		},
		async shareSubmit() {
			const req: any = {
				screenId: this.$route.params.id,
				screenShareType: this.shareType
			}
			if (this.shareType === 'PASSWORD') {
				req.screenSharePassword = this.sharePassword
			}
			if (this.shareType === 'TIME') {
				const now = new Date()
				const newTime = new Date(now.getTime() + this.shareTime * 60 * 60 * 1000)
				req.screenShareTime = formatTime(newTime)
				this.deadline = req.screenShareTime
			}
			await this.$api.screenShare.screenShareUpdate(req)
			this.shareUrl = `${location.origin}/shareScreen/${this.$route.params.id}`
		},
	},
	async created() {
		const res = await this.$api.screenShare.screenShareDetail({
			screenId: this.$route.params.id
		})
		this.shareType = res.screenShareType
		this.sharePassword = res.screenSharePassword || this.sharePassword
		if (res.screenShareTime) {
			this.shareTime = ((new Date(res.screenShareTime).getTime() - new Date().getTime()) / 3600000).toFixed(2)
			this.deadline = formatTime(res.screenShareTime)
		}
	}
}
