import Factory from '@/core/Base/factory'
import IndexDB from '@/core/IndexDB'
export default class ImageCache extends Factory<ImageCache> {
	db: IndexDB | null
	constructor(db: IndexDB) {
		super()
		this.db = db
	}

	// eslinkV.Editor.Instance().imageCache.add('/node/0eea7812-1522-4377-bce1-1a4576065af2/componentBackGround/1627631713184.jpg')
	// eslinkV.Editor.Instance().imageCache.get('/node/0eea7812-1522-4377-bce1-1a4576065af2/componentBackGround/1627631713184.jpg')

	async add(name: string): Promise<void> {
		const res = await fetch(name)
		const blob = await res.blob()
		await this.db.imageCache.put({
			name,
			picture: blob,
		})
	}

	// 测试不使用indexDB与使用indexDB 访问效率
	test(name: string): void {
		const img = document.createElement('img')
		img.src = name
		img.onload = function () {
			document.body.appendChild(img)
		}
	}

	async updateImg(name: string): Promise<void> {
		const res = await fetch(name)
		const blob = await res.blob()
		await this.db.imageCache.put({
			name,
			picture: blob,
		})
	}

	async get(name: string): Promise<string> {
		if (!name) return
		const collection: IImageCache = await this.db.imageCache.get({ name })
		if (collection) {
			// const img = document.createElement('img')
			// img.src = window.URL.createObjectURL(collection.picture)
			// document.body.appendChild(img)
			// this.updateImg(name)
			return window.URL.createObjectURL(collection.picture)
		} else {
			this.add(name)
			return name
		}
	}
}
