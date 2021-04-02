import { downloadFile } from '../../utils/index'

// todo 取消render
export default {
	methods: {
		handleExport() {
			const data = this.platFormData()
			const fileName = `${data.screenName}-${+new Date()}`
			this.$Modal.confirm({
				title: '看板导出',
				render: h => {
					return h('div', { class: 'form-wrapper' }, [
						h('p', '导出功能用于看板数据备份、迁移。'),
						h('div', { class: 'form-item' }, [
							h(
								'label',
								{ class: 'form-label text-right' },
								'文件名称：',
							),
							h('span', `${fileName}.json`),
						]),
					])
				},
				onOk: () => {
					const config = { ...data }
					config.data = config.screenConfig
					delete config.screenConfig
					downloadFile(config, fileName, 'json')
				},
				okText: '确定',
				cancelText: '取消',
			})
		},
	},
}