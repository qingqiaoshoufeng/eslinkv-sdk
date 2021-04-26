var loaderUtils = require('loader-utils');

var REG = /\/(?:\*|\/)\s*IF(DEBUG|TRUE_\w+)(?:\s*\*\/)?([\s\S]+?)(?:\/(?:\*|\/)\s*)?FI\1(\s*\*\/)?/g;

const replaceMatched = function (js, options) {
	return js.replace(REG, (match, $1, $2) => {
		var isKeep;
		if ($1 === 'DEBUG') {
			isKeep = options.DEBUG
		} else {
			var varName = $1.slice(5)
			isKeep = options[varName]
		}
		return isKeep ? $2 : ''
	});
}


module.exports = function (source) {
	var options = loaderUtils.getOptions(this) || {}
	if (!('DEBUG' in options)) {
		options.DEBUG = process.env.NODE_ENV === 'development'
	}
	if (!('PROD' in options)) {
		options.PROD = process.env.NODE_ENV === 'production'
	}
	return replaceMatched(source, options)
};
