import BaseCache from '@/core/IndexDB/baseCache'

export default class ImageCache extends BaseCache {
	async add(name: string): Promise<any> {
		const collection: ImageCacheDB = await this.db.imageCache.get({ name })
		const res = await fetch(name)
		const blob = await res.blob()
		if (collection) {
			return this.db.imageCache.update(collection.id, {
				name,
				picture: blob,
			})
		} else {
			return this.db.imageCache.put({
				name,
				picture: blob,
			})
		}
	}

	// 测试不使用indexDB与使用indexDB 访问效率
	test(name: string): void {
		const img = document.createElement('img')
		img.src = name
		img.onload = function () {
			document.body.appendChild(img)
		}
		// eslinkV.Editor.Instance().imageCache.add('/node/0eea7812-1522-4377-bce1-1a4576065af2/componentBackGround/1627631713184.jpg')
		// eslinkV.Editor.Instance().imageCache.get('/node/0eea7812-1522-4377-bce1-1a4576065af2/componentBackGround/1627631713184.jpg')
		// const img = document.createElement('img')
		// img.src = window.URL.createObjectURL(collection.picture)
		// document.body.appendChild(img)
	}

	async get(name: string): Promise<string> {
		if (!name) return
		const collection: ImageCacheDB = await this.db.imageCache.get({ name })
		if (collection) {
			return window.URL.createObjectURL(collection.picture)
		} else {
			this.add(name)
			return name
		}
	}
}
