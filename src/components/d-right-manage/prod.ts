export default {
	methods: {
		changeName() {
			const id = this.$route.params.id
			const screenName = document.getElementById('platform-name')
				.innerText
			this.editName = false
			this.platform.screenName = screenName
			this.$api.screen
				.update({
					screenId: id,
					screenName,
				})
				.then(() => {
					this.$Message.success('修改成功')
				})
		},
	},
}
