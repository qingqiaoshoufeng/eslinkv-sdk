import commonConfigValue from '../../common-config-value'
import Clipboard from 'clipboard'
import {Message} from 'view-design'

export function typeOf(e) {
	let t = Object.prototype.toString;
	return {
		"[object Boolean]": "boolean",
		"[object Number]": "number",
		"[object String]": "string",
		"[object Function]": "function",
		"[object Array]": "array",
		"[object Date]": "date",
		"[object RegExp]": "regExp",
		"[object Undefined]": "undefined",
		"[object Null]": "null",
		"[object Object]": "object"
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

export function deepCopy(e) {
	let t, r = typeOf(e);
	if ("array" === r) t = []; else {
		if ("object" !== r) return e;
		t = {}
	}
	if ("array" === r) for (let n = 0; n < e.length; n++) t.push(d.deepCopy(e[n])); else if ("object" === r) for (let o in e) t[o] = d.deepCopy(e[o]);
	return t
}

export function desensitize(e, t) {
	let r = new RegExp(t);
	return e.replace(r, function () {
		for (let e = {}, t = "", r = arguments.length, n = new Array(r), o = 0; o < r; o++) n[o] = arguments[o];
		for (let i in n[n.length - 1]) if (e[i] = n[n.length - 1][i], i.lastIndexOf("hide") >= 0) {
			e[i] = "";
			for (let a = 0; a < n[n.length - 1][i].length; a++) e[i] += "*"
		}
		for (let u in e) t += e[u];
		return t
	})
}

export function setDefaultBool(e, t) {
	return "boolean" == typeof e ? e : t || !1
}

export function isEmpty(e) {
	return "boolean" != typeof e && ("number" != typeof e && (("object" !== p()(e) || null == e) && (!e || void 0 === e || null === e || "" === e)))
}

export function isEmptyObject(e) {
	for (let t in e) return !1;
	return !0
}

export function toLength(e) {
	return "number" == typeof e ? e + "px" : "string" == typeof e ? e.indexOf("%") >= 0 || e.indexOf("px") >= 0 ? e : e + "px" : "0px"
}

export function isImageUrl(e) {
	let t = e.toLowerCase();
	return !!(t.indexOf(".jpg") >= 0 || t.indexOf(".jpeg") >= 0 || t.indexOf(".png") >= 0 || t.startsWith("data:image"))
}

/**
 * 处理formitem的校验规则
 *
 * @param {Object} template formitem
 * @returns 规则数组
 */
export function handlerRules(template) {
	let validate = [];
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
						// todo
						0: {
							type: 'string',
							required: true,
							message: '请选择时间段'
						},
						1: {
							type: 'string',
							required: true,
							message: '请选择时间段'
						}
					}
				});
			} else if (template.multiple) {
				validate.push({
					type: 'array',
					required: true,
					message: template.name + '不能为空',
					trigger: 'change'
				});
			} else {
				// todo
				validate.push({
					type: 'string',
					required: true,
					message: template.name + '不能为空',
					trigger: 'change'
				});
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
				trigger: 'change'
			});
		}
		// 输入类型
		else if (template.type === 1 || template.type === 5) {
			validate.push({
				type: 'string',
				required: true,
				message: template.name + '不能为空',
				trigger: 'blur'
			});
		}
		// 数字文本
		else if (template.type === 0) {
			validate.push({
				type: 'number',
				required: true,
				message: template.name + '不能为空',
				trigger: 'change'
			});
		}
		// 其他默认
		else {
			let type = '';
			if (
				template.dataSourceList &&
				template.dataSourceList.length > 0
			) {
				type = typeof template.dataSourceList[0].value;
			}
			validate.push({
				type: type || 'string',
				required: true,
				message: template.name + '不能为空',
				trigger: 'change'
			});
		}
	} else {
		validate.push({
			required: false
		});
	}
	// 正则校验，一般用于输入类型
	if (template.regexList && template.regexList.length > 0) {
		template.regexList.forEach((item) => {
			let reg;
			if (typeof item.regex === 'string') {
				reg = new RegExp(item.regex);
			} else {
				reg = item.regex;
			}
			validate.push({
				type: 'string',
				pattern: reg,
				message: item.message,
				trigger: item.trigger || 'blur'
			});
		});
	}
	if (template.validator) {
		validate.push(template.validator);
	}
	return validate;
}

/**
 * @description 向上查找 components
 */
export function findComponentUpward(context, componentName, componentNames) {
	if (typeof componentName === 'string') {
		componentNames = [componentName];
	} else {
		componentNames = componentName;
	}

	let parent = context.$parent;
	let name = parent.$options.name;
	while (parent && (!name || componentNames.indexOf(name) < 0)) {
		parent = parent.$parent;
		if (parent) name = parent.$options.name;
	}
	return parent;
}

/**
 * @description 向下查找 components
 */
export function findComponentsDownward(context, componentName) {
	return context.$children.reduce((components, child) => {
		if (child.$options.name === componentName) components.push(child);
		const foundChilds = findComponentsDownward(child, componentName);
		return components.concat(foundChilds);
	}, []);
}

/**
 * @description uuid
 */
export function uuid() {
	return Math.random().toString(36).replace('0.', '')
}

/**
 * @description 连字符转驼峰
 */
export function cssStyle2DomStyle(str) {
	if (str) {
		return str.replace(/(\w*)-(\w*)/g, function ($1, $2, $3) {
			return $2 + $3[0].toUpperCase() + $3.slice(1);
		})
	}
}

/**
 * @description 驼峰转连字符
 */
export function domStyle2CssStyle(str) {
	return str.replace(/([A-Z])/g, function ($1) {
		return '-' + $1.toLocaleLowerCase();
	});
}

/**
 * @description style对象转字符串 {background: '#fff', fontSize: '16px'} => "background: '#fff';font-size: 16px"
 */
export function styleObj2Str(styles = {}) {
	try {
		let cssStr = JSON.stringify(styles);
		cssStr = cssStr.replace(/\{|\}/g, '').replace(/,/g, ';');
		return domStyle2CssStyle(cssStr);
	} catch (error) {
		return ''
	}
}

/**
 * @description 获取url参数
 */
export function getQueryString(name) {
	let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
	let r = window.location.search.substr(1).match(reg)
	if (r != null) return unescape(r[2])
	return null
}

export const isObjectString = input => {
	if (typeof input !== 'string') return false
	input.trim()
	const length = input.length
	return input.indexOf('[') === 0 && input.lastIndexOf(']') === length - 1 || input.indexOf('{') === 0 && input.lastIndexOf('}') === length - 1
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
	jpg: 'image/jpeg'
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
		blob = new Blob([data], {type: types[type]})
	} else {
		if (data instanceof Blob || data instanceof File) {
			blob = data
		} else {
			blob = new Blob([JSON.stringify(data, null, 2)], {type: types[type]})
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
	let oCopyBtn = document.createElement('button')
	oCopyBtn.setAttribute('id', 'copy-btn')
	oCopyBtn.setAttribute('data-clipboard-text', text)
	document.body.appendChild(oCopyBtn)
	const clipboard = new Clipboard('#copy-btn')
	clipboard.on('success', e => {
		typeof success === 'function' && success(e)
		Message.success('复制成功！')
		clipboard.destroy()
		document.body.removeChild(oCopyBtn)
	});
	clipboard.on('error', e => {
		typeof error === 'function' && error(e)
		Message.error('复制失败！')
		clipboard.destroy()
		document.body.removeChild(oCopyBtn)
	})
	oCopyBtn.click()
}
