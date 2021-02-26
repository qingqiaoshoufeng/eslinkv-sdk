import request, {baseURL} from './request'

export default (data) => request.post(`${baseURL}/oss/uploadFile`, data)
