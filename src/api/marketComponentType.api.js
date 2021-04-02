import request, { headers } from './request'

export function level(data) {
	return request({
		url: '/market/componentType/level',
		method: 'post',
		data,
		headers,
	})
}
