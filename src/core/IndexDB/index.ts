import Dexie from 'dexie'

export default class IndexDB extends Dexie {
	public imageCache: Dexie.Table<ImageCache, number>

	public constructor() {
		super('EslinkVDB')
		this.version(1).stores({
			imageCache: '++id,picture,name',
		})
		this.imageCache = this.table('imageCache')
	}
}
