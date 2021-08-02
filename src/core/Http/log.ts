export default class Log {
	responseURL: string
	status: number
	responseText: string
	errorCount: number
	constructor(res) {
		const request: XMLHttpRequest = res.reason.request
		this.responseURL = request.responseURL
		this.status = request.status
		this.responseText = request.responseText
		this.errorCount = res.errorCount
	}
}
