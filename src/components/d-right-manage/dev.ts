export default {
	methods: {
		changeName() {
			const screenName = document.getElementById('platform-name')
				.innerText
			this.editName = false
			this.platform.screenName = screenName
		},
	},
}
