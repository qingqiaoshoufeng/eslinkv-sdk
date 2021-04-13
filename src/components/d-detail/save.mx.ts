export default {
	methods: {
		handleSave(type) {
			this.$Modal.confirm({
				title: `确定另保存${type === 'TEMPLATE' ? '模版' : ''}吗？`,
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.screenType = type
					let isNew = false
					if (this.screenType === 'CUSTOM' && type === 'TEMPLATE') {
						isNew = true
					}
					if (this.isNew || isNew) {
						this.addBoard()
					} else {
						this.editBoard()
					}
				},
			})
		},
		async addBoard() {
			this.loading = true
			const data = this.platFormData()
			data.screenType = this.screenType
			this.$api.screen
				.create(data)
				.then(() => {
					this.kanboardEdited = false
					this.$Message.success('保存成功！')
					this.loading = false
					this.$router.back()
				})
				.catch(() => {
					this.loading = false
				})
		},
		editBoard() {
			this.loading = true
			const data = this.platFormData()
			const {
				params: { id },
			} = this.$route
			data.screenType = this.screenType
			this.$api.screen
				.update({ ...data, screenId: id })
				.then(() => {
					this.kanboardEdited = false
					this.$Message.success('修改成功')
					this.loading = false
				})
				.catch(() => {
					this.loading = false
				})
		},
	},
}
