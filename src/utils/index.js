import commonConfigValue from '../../common-config-value'
import Clipboard from 'clipboard'
import { Message } from 'view-design'
import copy from 'fast-copy'

/**
 * @description 按照引用路径，查找末端数据
 */
export const usePath = (path, data) => {
	const keys = path ? path.split('.') : []
	while (keys.length) {
		const key = keys.shift()
		if (!key) {
			Message.warning(`数据源查找路径 ${path} 无效！`)
			break
		}
		data = data[key]
		if (data === undefined) {
			Message.warning(
				`数据源查找路径 ${path}，在 ${key} 处未引用到有效数据！`,
			)
			break
		}
	}
	return data
}
/**
 * @description 合并对象 生成一个新的对象,用前面的覆盖后面的
 */
export const configMerge = function (from, to) {
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

// todo: 整理无用，在用util
export function typeOf(e) {
	const t = Object.prototype.toString
	return {
		'[object Boolean]': 'boolean',
		'[object Number]': 'number',
		'[object String]': 'string',
		'[object Function]': 'function',
		'[object Array]': 'array',
		'[object Date]': 'date',
		'[object RegExp]': 'regExp',
		'[object Undefined]': 'undefined',
		'[object Null]': 'null',
		'[object Object]': 'object',
	}[t.call(e)]
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

export const deepCopy = e => {
	let t, d
	const r = typeOf(e)
	if (r === 'array') {
		t = []
	} else {
		if (r !== 'object') return e
		t = {}
	}
	if (r === 'array') {
		for (let n = 0; n < e.length; n++) {
			t.push(d.deepCopy(e[n]))
		}
	} else if (r === 'object') {
		for (const o in e) {
			t[o] = d.deepCopy(e[o])
		}
	}
	return t
}

export const desensitize = (e, t) => {
	const r = new RegExp(t)
	return e.replace(r, function () {
		for (
			let e = {}, t = '', r = arguments.length, n = new Array(r), o = 0;
			o < r;
			o++
		)
			n[o] = arguments[o]
		for (const i in n[n.length - 1]) {
			if (((e[i] = n[n.length - 1][i]), i.lastIndexOf('hide') >= 0)) {
				e[i] = ''
				for (let a = 0; a < n[n.length - 1][i].length; a++) e[i] += '*'
			}
		}
		for (const u in e) t += e[u]
		return t
	})
}

export function setDefaultBool(e, t) {
	return typeof e === 'boolean' ? e : t || !1
}

export function isEmpty(e) {
	return (
		typeof e !== 'boolean' &&
		typeof e !== 'number' &&
		(p()(e) !== 'object' || e == null) &&
		(!e || void 0 === e || e === null || e === '')
	)
}

export function isEmptyObject(e) {
	for (const t in e) return !1
	return !0
}

export function toLength(e) {
	return typeof e === 'number'
		? e + 'px'
		: typeof e === 'string'
		? e.indexOf('%') >= 0 || e.indexOf('px') >= 0
			? e
			: e + 'px'
		: '0px'
}

/**
 * 处理formitem的校验规则
 *
 * @param {Object} template formitem
 * @returns 规则数组
 */
export function handlerRules(template) {
	const validate = []
	// require校验
	if (template.required && template.type !== 16) {
		// 时间段类型
		if (template.type === 6) {
			if (
				template.timeType === 'daterange' ||
				template.timeType === 'datetimerange'
			) {
				validate.push({
					type: 'array',
					len: 2,
					required: true,
					message: template.name + '不能为空',
					trigger: 'change',
					fields: {
						0: {
							type: 'string',
							required: true,
							message: '请选择时间段',
						},
						1: {
							type: 'string',
							required: true,
							message: '请选择时间段',
						},
					},
				})
			} else if (template.multiple) {
				validate.push({
					type: 'array',
					required: true,
					message: template.name + '不能为空',
					trigger: 'change',
				})
			} else {
				validate.push({
					type: 'string',
					required: true,
					message: template.name + '不能为空',
					trigger: 'change',
				})
			}
		}
		// 多选，多选类型的组件，数据模型为array
		else if (
			template.multiple ||
			template.type === 3 ||
			template.type === 8 ||
			template.type === 10
		) {
			validate.push({
				type: 'array',
				required: true,
				message: template.name + '不能为空',
				trigger: 'change',
			})
		}
		// 输入类型
		else if (template.type === 1 || template.type === 5) {
			validate.push({
				type: 'string',
				required: true,
				message: template.name + '不能为空',
				trigger: 'blur',
			})
		}
		// 数字文本
		else if (template.type === 0) {
			validate.push({
				type: 'number',
				required: true,
				message: template.name + '不能为空',
				trigger: 'change',
			})
		}
		// 其他默认
		else {
			let type = ''
			if (template.dataSourceList && template.dataSourceList.length > 0) {
				type = typeof template.dataSourceList[0].value
			}
			validate.push({
				type: type || 'string',
				required: true,
				message: template.name + '不能为空',
				trigger: 'change',
			})
		}
	} else {
		validate.push({
			required: false,
		})
	}
	// 正则校验，一般用于输入类型
	if (template.regexList && template.regexList.length > 0) {
		template.regexList.forEach(item => {
			let reg
			if (typeof item.regex === 'string') {
				reg = new RegExp(item.regex)
			} else {
				reg = item.regex
			}
			validate.push({
				type: 'string',
				pattern: reg,
				message: item.message,
				trigger: item.trigger || 'blur',
			})
		})
	}
	if (template.validator) {
		validate.push(template.validator)
	}
	return validate
}

/**
 * @description 向上查找 components
 */
export function findComponentUpward(context, componentName, componentNames) {
	if (typeof componentName === 'string') {
		componentNames = [componentName]
	} else {
		componentNames = componentName
	}

	let parent = context.$parent
	let name = parent.$options.name
	while (parent && (!name || componentNames.indexOf(name) < 0)) {
		parent = parent.$parent
		if (parent) name = parent.$options.name
	}
	return parent
}

/**
 * @description 向下查找 components
 */
export function findComponentsDownward(context, componentName) {
	return context.$children.reduce((components, child) => {
		if (child.$options.name === componentName) components.push(child)
		const foundChilds = findComponentsDownward(child, componentName)
		return components.concat(foundChilds)
	}, [])
}

/**
 * @description uuid
 */
export function uuid() {
	return Math.random().toString(36).replace('0.', '')
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

export function isExternal(path) {
	return /^(https?:|mailto:|tel:)/.test(path)
}

const types = {
	json: 'application/json',
	txt: 'text/plain',
	html: 'text/html',
	js: 'application/javascript',
	png: 'image/png',
	jpg: 'image/jpeg',
}

/**
 * 文件下载函数
 * @author ferrinweb
 * @param {*} data 导出内容，可以是文本、对象、文件
 * @param {String} filename 文件名
 * @param {String} type 文件后缀
 */
export function downloadFile(data, filename, type) {
	let blob
	if (typeof data === 'string') {
		blob = new Blob([data], { type: types[type] })
	} else {
		if (data instanceof Blob || data instanceof File) {
			blob = data
		} else {
			blob = new Blob([JSON.stringify(data, null, 2)], {
				type: types[type],
			})
		}
	}
	const link = document.createElement('a')
	const url = URL.createObjectURL(blob)
	link.download = filename
	link.href = url
	link.click()
	URL.revokeObjectURL(url)
}

/**
 * @description 拷贝插件 kay
 */
export function copyText(text, success, error) {
	const oCopyBtn = document.createElement('button')
	oCopyBtn.setAttribute('id', 'copy-btn')
	oCopyBtn.setAttribute('data-clipboard-text', text)
	document.body.appendChild(oCopyBtn)
	const clipboard = new Clipboard('#copy-btn')
	clipboard.on('success', e => {
		typeof success === 'function' && success(e)
		Message.success('复制成功！')
		clipboard.destroy()
		document.body.removeChild(oCopyBtn)
	})
	clipboard.on('error', e => {
		typeof error === 'function' && error(e)
		Message.error('复制失败！')
		clipboard.destroy()
		document.body.removeChild(oCopyBtn)
	})
	oCopyBtn.click()
}
