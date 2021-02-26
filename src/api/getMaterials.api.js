import request, {baseURL} from './request'
import qs from 'qs'

// 查询资源列表
export default (data) => {
	return request({
		url: `${baseURL}/material/page`,
		method: 'post',
		data: qs.stringify(data),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
