import platform from '../../store/platform.store'
import Platform from '@/controller/Platform'

export default {
	data() {
		return {
			platform: platform.state,
		}
	},
	mounted() {
		const templateId = this.$route.query.templateId
		const id = this.$route.params.id || templateId
		const file = this.$route.params.file
		const initBefore = () => {
			this.loading = true
		}
		const initComplete = () => {
			this.loading = false
		}
		const initError = () => {
			this.loading = false
		}
		if (file) {
			new Platform({
				fileUrl: file,
				isLocalFile: true,
				initBefore,
				initComplete,
				initError,
			})
		}
		if (id) {
			new Platform({
				screenId: id,
				initBefore,
				initComplete,
				initError,
			})
		}
	},
}
