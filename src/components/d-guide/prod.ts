export default {
	methods: {
		updateHandle() {
			const id = this.$route.params.id
			if (id) {
				this.$api.screenShare.screenShareUpdate({
					screenId: id,
					screenGuide: this.platform.ruler.guideLines,
				})
			}
		},
	},
}
