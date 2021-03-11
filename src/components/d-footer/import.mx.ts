export default {
	data () {
		return {
			importModal: false
		}
	},
	methods: {
		handleFile (e) {
			const file = e.target.files[0]
			const reader = new FileReader()
			reader.onload = e => {
				try {
					this.loading = true
					const result = JSON.parse(e.target.result)
					const { data, createTime, name } = result
					this.renderByDetail({ name, attribute: data, createTime })
					this.importModal = false
					this.loading = false
				} catch (e) {
					this.$Message.error('配置文件识别失败')
				}
			}
			reader.onerror = () => {
				this.$Message.error('配置文件识别失败')
			}
			reader.readAsText(file)
		}
	}
}
