import copy from 'fast-copy'
import commonConfigValue from '@/core/common-config-value'

/**
 * @description uuid
 */
export function uuid(): string {
	return Math.random().toString(36).replace('0.', '')
}

/**
 * @description 合并对象 生成一个新的对象,用前面的覆盖后面的
 */
export const configMerge = function (from: any, to: any): any {
	const output = copy(to)
	const isArray = Array.isArray(from)
	;(!isArray ? Object.keys(from) : from).forEach((key, index) => {
		const actualKey = !isArray ? key : index
		const value = from[actualKey]
		if (value && typeof value === 'object') {
			if (!output[actualKey]) {
				output[actualKey] = !Array.isArray(value)
					? { ...value }
					: [...value]
				return
			}
			output[actualKey] = configMerge(value, output[actualKey])
		} else if (value !== undefined) {
			output[actualKey] = value
		}
	})
	return output
}

/**
 * @description 1.0.0 --->100000
 * 每一位限两位数
 */
export function versionToNum(version: string): number {
	let num = version.split('.')
	num = num.map(item => {
		if (Number(item) >= 99) item = '99'
		if (Number(item) < 10) {
			item = '0' + item
		}
		return item
	})
	return Number(num.join(''))
}

/**
 * @description 获取url参数
 */
export function getQueryString(name) {
	const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
	const r = window.location.search.substr(1).match(reg)
	if (r != null) return unescape(r[2])
	return null
}

function getAttr(o, str) {
	const arr = str.split('.')
	let res = o
	arr.forEach(v => {
		res = res[v]
	})
	return res
}
export function setDefault(o, str = '', defaultConfig = commonConfigValue()) {
	for (const key in o) {
		const prop = str ? str + '.' + key : key
		if (Object.prototype.toString.call(o[key]) === '[object Object]') {
			setDefault(o[key], prop, defaultConfig)
		} else if (o[key] === 'default') {
			const defaultValue = getAttr(defaultConfig, prop)
			if (defaultValue === undefined) return
			o[key] = JSON.parse(JSON.stringify(defaultValue))
		}
	}
}
