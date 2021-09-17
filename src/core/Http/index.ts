import Emitter from './emitter'
import Task from './task'
export default class Http extends Emitter {
	limit = 6
	/* 大屏组件接口Domain */
	screenDomain: string
	/* 大屏组件接口Headers */
	screenHeaders: string
	//时间loop任务队列
	private loopPool: { [key: string]: Task } = {}
	// private loopPoolObj: { [key: string]: Task } = {}

	//待请求任务队列
	private waitPool: Array<Task> = []

	//请求任务队列
	private currentPool: number = 0
	private loading = false
	static POOL_START = 'pool_start'
	static POOL_ADD = 'pool_add'
	static POOL_UPDATE = 'pool_update'
	static POOL_STOP = 'pool_stop'

	// todo
	// 报错捕获是否抛出，node服务增加字段，默认false
	// private httpErrorDebugger = false

	private timer: any = null
	constructor() {
		super()
	}

	init(): void {}

	// sortTask(): void {
	// 	this.waitPool.sort((a: Task, b: Task): number => {
	// 		return b.weight - a.weight
	// 	})
	// }

	pushOne(task: Task, id?: string): void {
		if (task.loopTime > 0) {
			this.loopPool[id] = task
			this.startInterval()
		}
		this.push2Wait(task)
	}

	private push2Wait(task: Task) {
		this.waitPool.unshift(task)
		// this.sortTask()
		task.status = Task.STATUS_WAITTING
		this.emit(Http.POOL_ADD)
		if (!this.loading) {
			this.emit(Http.POOL_START)
			this.run()
		}
	}

	private retry(t: Task, res) {
		t.errorCount++
		if (t.errorCount < t.maxErrorCount) {
			t.status = Task.STATUS_RETRY
			this.push2Wait(t)
		} else {
			t.catchCB(res)
		}
	}

	private startInterval(): void {
		if (this.timer) return
		this.timer = setInterval(() => {
			Object.keys(this.loopPool).forEach(key => {
				if (Date.now() - this.loopPool[key].lastTime > this.loopPool[key].loopTime && this.loopPool[key]) {
					this.push2Wait(this.loopPool[key])
				}
			})
		}, 1000)
	}

	private run() {
		this.loading = true
		if (this.waitPool.length) {
			while (this.currentPool < this.limit && this.waitPool.length) {
				const task = this.waitPool.shift()
				this.currentPool++
				task.status = Task.STATUS_READY
				console.log(task.url, this.waitPool.length)
				task.execut({ screenDomain: this.screenDomain, screenHeaders: this.screenHeaders })
					.then(r => {
						this.emit(Http.POOL_UPDATE)
						task.status = Task.STATUS_FINISH
						task.thenCb(r)
					})
					.catch(error => {
						if (task.loopTime === 0) {
							this.retry(task, error)
						}
					})
					.finally(() => {
						this.currentPool--
						task.lastTime = Date.now()
						this.run()
					})
			}
		} else {
			this.stop()
		}
	}
	// 停止某一个请求
	abortOne(id: string): void {
		delete this.loopPool[id]
	}

	/* 清空队列中的请求 */
	public abortAll(): void {
		this.waitPool = []
		this.loopPool = {}
		this.currentPool = 0
		this.stop()
		this.stopLoop()
	}

	private stop() {
		this.loading = false
		this.emit(Http.POOL_STOP)
	}
	private stopLoop() {
		if (this.timer) {
			clearInterval(this.timer)
			this.timer = null
		}
	}
}
