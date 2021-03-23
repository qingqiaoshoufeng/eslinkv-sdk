import request, { headers } from './request'

export function list (data) {
    return request({
        url: '/market/component/list',
        method: 'post',
        data,
        headers
    })
}

export function use (data) {
    return request({
        url: '/market/component/use',
        method: 'post',
        data,
        headers
    })
}
