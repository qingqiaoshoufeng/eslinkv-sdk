import request, { baseURL, headers } from './request'
import qs from 'qs'
import { setDefault } from '../utils'
import platform from '../store/platform.store'

export function add (data) {
    return request({
        url: `${baseURL}/screen/create`,
        method: 'post',
        data: qs.stringify(data),
        headers
    })
}

export function publish (data) {
    return request({
        url: `${baseURL}/screen/publish`,
        method: 'post',
        data: qs.stringify(data),
        headers
    })
}

export async function detail (data) {
    const originData = await request({
        url: `${baseURL}/screen/detail`,
        method: 'post',
        data: qs.stringify(data),
        headers
    })
    platform.state.currentType = originData.screenType
    const res = JSON.parse(originData.screenConfig)
    if (res.widgets) {
        res.widgets.forEach(v => {
            setDefault(v.value)
        })
    }
    return {
        ...originData,
        screenConfig: JSON.stringify(res)
    }
}

export function update (data) {
    return request({
        url: `${baseURL}/screen/update`,
        method: 'post',
        data: qs.stringify(data),
        headers
    })
}

export function remove (data) {
    return request({
        url: `${baseURL}/screen/destroy`,
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

export function detailFile (url) {
    return request({
        url,
        method: 'get',
        headers,
        dataType: 'json'
    })
}
