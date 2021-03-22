import request, { baseURL, jsonHeaders } from './request'

export function list (data) {
    return request({
        url: baseURL + '/market/component/list',
        method: 'post',
        data,
        headers: jsonHeaders
    })
}
