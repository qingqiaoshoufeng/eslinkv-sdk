const loaderUtils = require('loader-utils')

const REG = /\/(?:\*|\/)\s*START_(DEV|PROD)(?:\s*\*\/)?([\s\S]+?)(?:\/(?:\*|\/)\s*)?END_\1(\s*\*\/)?/g

const replaceMatched = function (js, options) {
	return js.replace(REG, (match, $1, $2) => {
		let isKeep
		if ($1 === 'DEV') {
			isKeep = options.DEBUG
		} else {
			const varName = $1.slice(5)
			isKeep = options[varName]
		}
		return isKeep ? $2 : ''
	})
}

module.exports = function (source) {
	const options = loaderUtils.getOptions(this) || {}
	if (!('DEV' in options)) {
		options.DEBUG = process.env.VUE_APP_ESLINKV_MODE === 'DEV'
	}
	if (!('PROD' in options)) {
		options.PROD = process.env.VUE_APP_ESLINKV_MODE === 'PROD'
	}
	return replaceMatched(source, options)
}
