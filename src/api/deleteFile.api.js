import request, {baseURL} from './request'

export function post(data) {
	return request.post(
		`${baseURL}/oss/delete`,
		data
	)
}
