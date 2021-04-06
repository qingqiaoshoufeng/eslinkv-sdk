import request, { headers } from './request'

export function list(data) {
	return request({
		url: '/market/component/list',
		method: 'post',
		data,
		headers,
	})
}

export function use(data) {
	return request({
		url: '/market/component/use',
		method: 'post',
		data,
		headers,
	})
}

export function typeList(data) {
	return request({
		url: '/market/component/typeList',
		method: 'post',
		data,
		headers,
	})
}

export function update(data) {
	return request({
		url: '/market/component/update',
		method: 'post',
		data,
		headers,
	})
}

export function getVersionList(data) {
	return request({
		url: '/market/component/version',
		method: 'post',
		data,
		headers,
	})
}
