import request, { headers } from './request'
import qs from 'qs'

const DATAURL = '/data'

// 获取组件详情
export function detailMarket (data) {
    return request({
        url: `${DATAURL}/component/getComponentDetail`,
        method: 'get',
        params: data,
        headers
    })
}

// 获取一级分类列表
export function getLevel0 () {
    return request({
        url: `${DATAURL}/componentType/getLevel0`,
        method: 'get',
        headers
    })
}

// 获取所有组件列表
export function getCompListAll (data) {
    return request({
        url: `${DATAURL}/component/list`,
        method: 'get',
        params: data,
        headers
    })
}

// 获取审核历史
export function getCheckHistoryList (data) {
    return request({
        url: `${DATAURL}/component/checkHistoryList`,
        method: 'get',
        params: data,
        headers
    })
}

// 获取未审核列表
export function getWaitCheckList (data) {
    return request({
        url: `${DATAURL}/component/waitCheckList`,
        method: 'get',
        params: data,
        headers
    })
}

// 上传图片
export function uploadFile (data) {
    return request({
        url: `${DATAURL}/saveImage`,
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 审核通过
export function checkSuccess (data) {
    return request({
        url: `${DATAURL}/component/checkSuccess`,
        method: 'post',
        data: qs.stringify(data),
        headers
    })
}

// 审核未通过
export function checkError (data) {
    return request({
        url: `${DATAURL}/component/checkError`,
        method: 'post',
        data: qs.stringify(data),
        headers
    })
}

// 获取所有组件分类
export function getAllComponentType () {
    return request({
        url: `${DATAURL}/componentType/getAllComponentType`,
        method: 'get',
        headers
    })
}

// 获取组件列表
export async function getCompList (data) {
    const res = await request({
        url: `${DATAURL}/componentType/list`,
        method: 'get',
        params: data,
        headers
    })
    res.forEach(v => {
        v.label = v.componentTypeName
        v.type = v.componentTypeEnName
        v.widgets.forEach(w => {
            w.label = w.componentTitle
            w.type = w.componentEnTitle
            w.market = true
        })
    })
    return res
}

// 删除组件
export function destroyComponent (data) {
    return request({
        url: `${DATAURL}/component/destroy`,
        method: 'post',
        data: qs.stringify(data),
        headers
    })
}

// 新增组件
export function createComponent (data) {
    return request({
        url: `${DATAURL}/component/create`,
        method: 'post',
        data: qs.stringify(data),
        headers
    })
}

// 修改组件
export function updateComponent (data) {
    return request({
        url: `${DATAURL}/component/update`,
        method: 'post',
        data: qs.stringify(data),
        headers
    })
}

// 新增组件版本
export function addComponentVersion (data) {
    return request({
        url: `${DATAURL}/component/addVersion`,
        method: 'post',
        data: qs.stringify(data),
        headers
    })
}

// 切换版本
export function changeComponentVersion (data) {
    return request({
        url: `${DATAURL}/component/changeVersion`,
        method: 'post',
        data: qs.stringify(data),
        headers
    })
}

// 获取所有版本
export function getVersionList (data) {
    return request({
        url: `${DATAURL}/component/getVersionList`,
        method: 'get',
        params: data,
        headers
    })
}
