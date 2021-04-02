export default {
	methods: {
		publishBoard() {
			if (this.kanboardEdited) {
				this.$Message.warning('请先保存看板！')
				return
			}
			this.$Modal.confirm({
				title: '提示',
				content: '确认发布此看板吗？',
				loading: true,
				onOk: () => {
					const {
						params: { id },
					} = this.$route
					this.$api.screen
						.publish({ screenId: id })
						.then(() => {
							this.$Message.success('发布成功！')
							this.$router.push('/')
							this.exit()
							this.$Modal.remove()
						})
						.catch(() => {
							this.$Modal.remove()
						})
				},
			})
		},
	},
}