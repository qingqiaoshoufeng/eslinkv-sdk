import request, {baseURL} from './request'
import qs from 'qs'
import {setDefault} from '../utils'
import platform from '../store/platform.store'

export function add(data) {
	return request({
		url: `${baseURL}/board/save`,
		method: 'post',
		data: qs.stringify(data),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}

export function publish(data) {
	return request({
		url: `${baseURL}/board/publish`,
		method: 'post',
		data: qs.stringify(data),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}

export async function detail(data) {
	let originData = await request({
		url: `${baseURL}/board/detail`,
		method: 'post',
		data: qs.stringify(data),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
	platform.state.currentType = originData.type
	const res = JSON.parse(originData.attribute)
	if (res.widgets) {
		res.widgets.forEach(v => {
			setDefault(v.value)
		})
	}
	return {
		...originData,
		attribute: JSON.stringify(res)
	}
}

export function update(data) {
	return request({
		url: `${baseURL}/board/update`,
		method: 'post',
		data: qs.stringify(data),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}

export function remove(data) {
	return request({
		url: `${baseURL}/board/delete`,
		method: 'post',
		data: qs.stringify(data),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}

export function detailMarket(data) {
	return request({
		url: `${dataURL}/market/detail`,
		method: 'post',
		data: qs.stringify(data),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
