import request, { headers } from './request'

export function getLevel (data) {
    return request({
        url: '/market/componentType/level',
        method: 'post',
        data,
        headers
    })
}
