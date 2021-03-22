import request, { baseURL, headers, jsonHeaders } from './request'
import { setDefault } from '../utils'
import platform from '../store/platform.store'

export function add (data) {
    return request({
        url: `${baseURL}/screen/create`,
        method: 'post',
        data,
        headers: jsonHeaders
    })
}

export function publish (data) {
    return request({
        url: `${baseURL}/screen/publish`,
        method: 'post',
        data,
        headers: jsonHeaders
    })
}

export async function detail (data) {
    const originData = await request({
        url: `${baseURL}/screen/detail`,
        method: 'post',
        data,
        headers: jsonHeaders
    })
    platform.state.currentType = originData.screenType
    const res = originData.screenConfig
    if (res.widgets) {
        res.widgets.forEach(v => {
            setDefault(v.value)
        })
    }
    return {
        ...originData,
        screenConfig: res
    }
}

export function update (data) {
    return request({
        url: `${baseURL}/screen/update`,
        method: 'post',
        data: data,
        headers: jsonHeaders
    })
}

export function remove (data) {
    return request({
        url: `${baseURL}/screen/destroy`,
        method: 'post',
        data,
        headers: jsonHeaders
    })
}

export function detailMarket (data) {
    return request({
        url: `${baseURL}/market/detail`,
        method: 'post',
        data,
        headers: jsonHeaders
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
