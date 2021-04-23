const dev = require('./config.dev')
const prod = require('./config.prod')
const config = process.env.VUE_APP_ESLINKV_MODE === 'DEV' ? dev : prod
module.exports = {
	colorTheme: {
		colorDisk: [
			'#00DDFF',
			'#0B88FF',
			'#624BEB',
			'#FA71CB',
			'#FFDC45',
			'#E5615B',
			'#00FFCF',
			'#FF9F61',
		],
	},
	...config,
}
