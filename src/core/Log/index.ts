import Factory from '@/core/Base/factory'
import Log from '@/core/Log/base'
import { uuid } from '@/core/utils'
export default class Emitter extends Factory<Emitter> {
	list: { [key: string]: Log } = {}

	push(log: Log): void {
		let key
		if (log.widget) {
			key = `${log.widget.id}${log.code}`
		} else {
			key = `${uuid()}${log.code}`
		}
		this.list = { ...this.list, [key]: log }
	}

	clear(): void {
		this.list = {}
	}

	constructor() {
		super()
		console.warnning = function (errorMessage) {
			this.push(new Log({ code: 'OTHERS', errorMessage }))
		}.bind(this)
	}
}
