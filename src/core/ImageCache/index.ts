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

	async add(url: string): void {
		const res = await fetch(url)
		const blob = await res.blob()
		await this.db.imageCache.put({
			name: url,
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

	async get(name: string): ImageCache {
		const collection: ImageCache = await this.db.imageCache.get({ name })
		if (collection) {
			const img = document.createElement('img')
			img.src = window.URL.createObjectURL(collection.picture)
			document.body.appendChild(img)
			return collection
		} else {
		}
	}
}
