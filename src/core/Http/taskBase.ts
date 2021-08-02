import axios, { AxiosRequestConfig } from 'axios'
export default class HttpBase {
	method = ''
	url = ''
	headers = {}
	params: any = ''

	constructor(method: string, url: string, params: any, headers?: any) {
		this.method = method
		this.url = url
		this.params = params
		this.headers = headers
	}

	public request(config: any): Promise<any> {
		const request = axios.create()
		return new Promise<any>((resolve, reject) => {
			const requestConfig: AxiosRequestConfig = {
				method: this.method,
				url: this.url,
				params: this.params,
				data: this.params,
				...config,
			}
			request
				.request(requestConfig)
				.then((res: any) => {
					resolve(res.data)
				})
				.catch((error: any) => {
					reject(error)
				})
		})
	}
}
