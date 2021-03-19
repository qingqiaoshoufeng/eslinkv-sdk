import request, { baseURL, headers } from './request'
import qs from 'qs'
import { setDefault } from '../utils'
import platform from '../store/platform.store'

export function add (data) {
    return request({
        url: `${baseURL}/screen/create`,
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function publish (data) {
    return request({
        url: `${baseURL}/screen/publish`,
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export async function detail (data) {
    const originData = await request({
        url: `${baseURL}/screen/detail`,
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json'
        }
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
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function remove (data) {
    return request({
        url: `${baseURL}/screen/destroy`,
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function detailMarket (data) {
    return request({
        url: `${baseURL}/market/detail`,
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json'
        }
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
