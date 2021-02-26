import {Message} from 'view-design'
import axios from 'axios'

const request = axios.create()
const baseURL = '/api'
const serverURL = '/server'
const baseHRURL = '/hangran'
request.defaults.timeout = 30000
request.interceptors.request.use(function (config) {
	return config;
}, function (error) {
	return Promise.reject(error)
});

/**
 * @description
 * {
 *   result: '数据',
 *   responseCode: 0,
 *   message：'错误信息'
 * }
 */
let errMessage = '网络异常，请重试'
request.interceptors.response.use(response => {
	const {data} = response;
	if (data) {
		if (data.responseCode === '100000') {
			return data.result
		} else if (data.responseCode === '101002') {
			// 未登录
			Message.error(data.message || errMessage)
			return Promise.reject(false)
		} else {
			Message.error(data.message || errMessage)
			return Promise.reject(false)
		}
	} else {
		Message.error(errMessage)
		return Promise.reject(false)
	}
}, function (e) {
	Message.error(errMessage)
	return Promise.reject(false)
})

export {baseURL, baseHRURL, serverURL}

export default request
