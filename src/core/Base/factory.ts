﻿// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class Singleton<T> {
	static Instance<T>(obj?: any): T {
		if (!window.eslinkvEditorInstance) window.eslinkvEditorInstance = {}
		if (!window.eslinkvEditorInstance[this.name]) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			window.eslinkvEditorInstance[this.name] = new this(obj)
		}
		return  window.eslinkvEditorInstance[this.name]
	}
}

export default class Factory<T> extends Singleton<T> {}
