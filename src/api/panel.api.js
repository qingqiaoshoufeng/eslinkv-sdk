import request, {baseURL} from './request'
import qs from 'qs'

// 查询看板列表
export function list(data) {
	return request({
		method: 'post',
		url: `${baseURL}/board/page`,
		data: qs.stringify(data),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}

// 发布看板
export function publish(data) {
	return request({
		method: 'post',
		url: `${baseURL}/board/publish`,
		data: qs.stringify(data),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
