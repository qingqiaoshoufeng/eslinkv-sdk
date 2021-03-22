import { Message } from 'view-design'
import axios from 'axios'

const request = axios.create()
const baseURL = '/node'
const serverURL = '/server'
const baseHRURL = '/hangran'

export const headers = {
	'Content-Type': 'application/x-www-form-urlencoded'
}

export const jsonHeaders = {
    'Content-Type': 'application/json'
}
request.defaults.timeout = 30000
request.interceptors.request.use(function (config) {
	return config
}, function (error) {
	return Promise.reject(error)
})

/**
 * @description
 * {
 *   result: '数据',
 *   responseCode: 0,
 *   message：'错误信息'
 * }
 */
const errMessage = '网络异常，请重试'
request.interceptors.response.use(response => {
	const { data } = response
	if (data) {
		if (data.code === 200) {
			return data.result
		}
		if (data.responseCode === '101002') {
			// todo: 未登录
			Message.error(data.message || errMessage)
			// eslint-disable-next-line prefer-promise-reject-errors
			return Promise.reject(false)
		}
		Message.error(data.message || errMessage)
		// eslint-disable-next-line prefer-promise-reject-errors
		return Promise.reject(false)
	} else {
		Message.error(errMessage)
		// eslint-disable-next-line prefer-promise-reject-errors
		return Promise.reject(false)
	}
}, function (e) {
	Message.error(errMessage)
	// eslint-disable-next-line prefer-promise-reject-errors
	return Promise.reject(false)
})

export { baseURL, baseHRURL, serverURL }

export default request
