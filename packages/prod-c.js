import { configMerge } from '../src/utils'
import commonConfigValue from '../common-config-value.js'
import { colorTheme } from './config.default'
import Editor from '../src/core/Editor/index.ts'

const eslinkV = {
	Editor,
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

export { colorTheme, configMerge, commonConfigValue, Editor }
export default eslinkV
