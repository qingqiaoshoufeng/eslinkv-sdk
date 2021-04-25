import { configMerge } from '../src/utils'
import commonConfigValue from '../common-config-value.js'
import { colorTheme } from './config.default'

const eslinkV = {
	colorTheme,
	configMerge,
	commonConfigValue,
}
if (window !== undefined) {
	if (!window.eslinkV) {
		window.eslinkV = {}
	}
	window.eslinkV = { ...window.eslinkV, ...eslinkV }
}

export { colorTheme, configMerge, commonConfigValue }
export default eslinkV
