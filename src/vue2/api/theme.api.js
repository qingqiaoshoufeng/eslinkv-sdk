import request, { headers } from './request'

export function list(data) {
	return request({
		url: '/theme/allList',
		method: 'post',
		data,
		headers,
	})
}

export function create(data) {
	return request({
		url: '/theme/create',
		method: 'post',
		data,
		headers,
	})
}

export function destroy(data) {
	return request({
		url: '/theme/destroy',
		method: 'post',
		data,
		headers,
	})
}

export function detail(data) {
	return request({
		url: '/theme/detail',
		method: 'post',
		data,
		headers,
	})
}

export function update(data) {
	return request({
		url: '/theme/update',
		method: 'post',
		data,
		headers,
	})
}
