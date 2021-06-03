export class Singleton<T> {
	private static instance: any = null
	public static Instance<T>(obj?: any): T {
		if (this.instance == null) {
			this.instance = new this(obj)
		}
		return this.instance
	}
}

export default class Factory<T> extends Singleton<T> {}
