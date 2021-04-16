import request, { headers } from './request'

export function screenShareUpdate(data) {
	return request({
		url: '/screenShare/update',
		method: 'post',
		data,
		headers,
	})
}

export function screenShareDetail(data) {
	return request({
		url: '/screenShare/detail',
		method: 'post',
		data,
		headers,
	})
}
