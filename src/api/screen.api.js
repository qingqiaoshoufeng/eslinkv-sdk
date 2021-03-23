import request, { headers } from './request'
import { setDefault } from '../utils'
import platform from '../store/platform.store'

export function create (data) {
    return request({
        url: '/screen/create',
        method: 'post',
        data,
        headers
    })
}

export function publish (data) {
    return request({
        url: '/screen/publish',
        method: 'post',
        data,
        headers
    })
}

export async function detail (data) {
    const originData = await request({
        url: '/screen/detail',
        method: 'post',
        data,
        headers
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
        url: '/screen/update',
        method: 'post',
        data: data,
        headers
    })
}
