import request, { headers } from './request'

export function list (data) {
    return request({
        url: '/market/component/list',
        method: 'post',
        data,
        headers
    })
}
