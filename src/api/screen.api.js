import request, { headers, requestNoBaseURL } from './request'
import { setDefault } from '../utils'

export function list(data) {
	return request({
		url: '/screen/list',
		method: 'post',
		headers,
		data,
	})
}

export function destroy(data) {
	return request({
		url: '/screen/destroy',
		method: 'post',
		headers,
		data,
	})
}

export function create(data) {
	return request({
		url: '/screen/create',
		method: 'post',
		data,
		headers,
	})
}

export function publish(data) {
	return request({
		url: '/screen/publish',
		method: 'post',
		data,
		headers,
	})
}

export async function detail(data) {
	const originData = await request({
		url: '/screen/detail',
		method: 'post',
		data,
		headers,
	})
	const res = originData.screenConfig
	if (res.widgets) {
		res.widgets.forEach(v => {
			setDefault(v.value)
		})
	}
	return {
		...originData,
		screenConfig: res,
	}
}

export function update(data) {
	return request({
		url: '/screen/update',
		method: 'post',
		data: data,
		headers,
	})
}

export function detailFile(url) {
	return requestNoBaseURL({
		url,
		method: 'get',
		headers,
		dataType: 'json',
	})
}
