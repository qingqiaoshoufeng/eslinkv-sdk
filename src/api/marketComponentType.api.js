import request, { baseURL, jsonHeaders } from './request'

export function getLevel (data) {
    return request({
        url: `${baseURL}/market/componentType/level`,
        method: 'post',
        data,
        headers: jsonHeaders
    })
}
