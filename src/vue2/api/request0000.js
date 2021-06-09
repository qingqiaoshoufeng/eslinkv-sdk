import { Message } from 'view-design'
import axios from 'axios'

const request = axios.create()
request.defaults.timeout = 30000
request.interceptors.request.use(
	function (config) {
		return config
	},
	function (error) {
		return Promise.reject(error)
	},
)

/**
 * @description
 * {
 *   result: '数据',
 *   returnCode: 0,
 *   returnMessage：'错误信息'
 * }
 */
const errMessage = '网络异常，请重试'
request.interceptors.response.use(
	response => {
		const { data } = response
		if (data) {
			if (data.returnCode === '0000') {
				return data
			} else if (data.responseCode === '100000') {
				return data.result
			} else {
				Message.error(data.returnMessage || errMessage)
				// eslint-disable-next-line prefer-promise-reject-errors
				return Promise.reject(false)
			}
		} else {
			Message.error(errMessage)
			// eslint-disable-next-line prefer-promise-reject-errors
			return Promise.reject(false)
		}
	},
	function (e) {
		Message.error(errMessage)
		// eslint-disable-next-line prefer-promise-reject-errors
		return Promise.reject(false)
	},
)

export default request
