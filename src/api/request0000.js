import {Message} from 'view-design'
import axios from 'axios'

const request = axios.create()
const baseURL = '/api'
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
 *   returnCode: 0,
 *   returnMessage：'错误信息'
 * }
 */
let errMessage = '网络异常，请重试'
request.interceptors.response.use(response => {
	const {data} = response;
	if (data) {
		if (data.returnCode === '0000') {
			return data
		}  else {
			Message.error(data.returnMessage || errMessage)
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

export {baseURL}

export default request
