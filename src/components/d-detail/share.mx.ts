import { copyText } from '../../utils/index'
export default {
	data() {
		return {
			shareModal: false,
			shareType: 'PASSWORD',
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
		shareSubmit() {},
	},
}
