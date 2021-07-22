import Emitter from './emitter'
import Task from './task'
export default class Http extends Emitter {
	limit = 1

	//时间loop任务队列
	private loopPool: Array<Task> = []

	//待请求任务队列
	private waitPool: Array<Task> = []

	//请求任务队列
	private currentPool: Array<Task> = []
	private loading = false
	static POOL_START = 'pool_start'
	static POOL_ADD = 'pool_add'
	static POOL_UPDATE = 'pool_update'
	static POOL_STOP = 'pool_stop'

	private timer: any = null
	constructor() {
		super()
	}

	public init() {}

	public sortTask() {
		//todo 按权重排序，有优化空间
		this.waitPool.sort((a: Task, b: Task): number => {
			return b.weight - a.weight
		})
	}

	public pushOne(task: Task) {
		if (task.loopTime > 0) {
			this.loopPool.push(task)
			this.startInterval()
		}
		this.push2Wait(task)
	}

	private push2Wait(task: Task) {
		this.waitPool.push(task)
		this.sortTask()
		task.status = Task.STATUS_WAITTING
		this.emit(Http.POOL_ADD)
		if (!this.loading) {
			this.emit(Http.POOL_START)
			this.run()
		}
	}

	private retry(t: Task) {
		t.errorCount++
		if (t.errorCount < t.maxErrorCount) {
			this.push2Wait(t)
		}
	}

	private startInterval(): void {
		if (this.timer) return
		this.timer = setInterval(() => {
			this.loopPool.forEach((task: Task) => {
				if (Date.now() - task.lastTime > task.loopTime) {
					this.push2Wait(task)
				}
			})
		}, 1000)
	}

	private run() {
		this.loading = true
		if (this.waitPool.length > 0) {
			this.currentPool = this.waitPool.splice(0, this.limit)
			const list: Array<Promise<any>> = []
			this.currentPool.forEach(task => {
				task.status = Task.STATUS_READY
				list.push(task.execut())
			})
			//todo allSettled 兼容性问题
			Promise.allSettled(list).then(result => {
				this.emit(Http.POOL_UPDATE)
				result.forEach((res, index) => {
					let t: Task = this.currentPool[index]
					if (res.status === 'rejected') {
						//todo 定时刷新的接口不用尝试重联
						if (t.loopTime === 0) {
							this.retry(t)
						}
					} else {
						t.status = Task.STATUS_FINISH
						t.thenCb(res.value)
					}
					t.lastTime = Date.now()
				})
				this.run()
			})
		} else {
			this.stop()
		}
	}

	abortOne() {}
	/**
	 * 清空队列中的请求
	 */
	public abortAll() {
		this.waitPool = []
		this.loopPool = []
		this.currentPool = []
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
