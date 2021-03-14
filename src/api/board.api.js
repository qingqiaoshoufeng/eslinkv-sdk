import request, { baseURL, headers } from './request'
import qs from 'qs'
import { setDefault } from '../utils'
import platform from '../store/platform.store'

export function add (data) {
    return request({
        url: `${baseURL}/board/save`,
        method: 'post',
        data: qs.stringify(data),
        headers
    })
}

export function publish (data) {
    return request({
        url: `${baseURL}/board/publish`,
        method: 'post',
        data: qs.stringify(data),
        headers
    })
}

export async function detail (data) {
    const originData = await request({
        url: `${baseURL}/board/detail`,
        method: 'post',
        data: qs.stringify(data),
        headers
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

export function update (data) {
    return request({
        url: `${baseURL}/board/update`,
        method: 'post',
        data: qs.stringify(data),
        headers
    })
}

export function remove (data) {
    return request({
        url: `${baseURL}/board/delete`,
        method: 'post',
        data: qs.stringify(data),
        headers
    })
}

export function detailMarket (data) {
    return request({
        url: `${baseURL}/market/detail`,
        method: 'post',
        data: qs.stringify(data),
        headers
    })
}
