import { Modal } from 'view-design'

export default {
	methods: {
		handleSave(type) {
			let isNew = false
			if (this.screen.screenType === 'CUSTOM' && type === 'TEMPLATE') {
				isNew = true
			}
			this.screen.screenType = type
			Modal.confirm({
				title: `确定${this.isNew || isNew ? '创建' : '更新'}${
					this.screenType === 'TEMPLATE' ? '大屏模版' : '大屏'
				}吗？`,
				content: '回收站内的组件将被清除！',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.loading = true
					if (this.isNew || isNew) {
						this.screen
							.createScreen()
							.then(() => {
								this.loading = false
								this.$router.back()
							})
							.catch(() => {
								this.loading = false
							})
					} else {
						this.screen
							.updateScreen()
							.then(() => {
								this.loading = false
							})
							.catch(() => {
								this.loading = false
							})
					}
				},
			})
		},
	},
}
