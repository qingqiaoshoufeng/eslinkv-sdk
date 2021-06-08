import scene from '../src/store/scene.store'
import instance from '../src/store/instance.store'

const eslinkV = {
	scene,
	instance,
}
if (window !== undefined) {
	if (!window.eslinkV) {
		window.eslinkV = {}
	}
	window.eslinkV = { ...window.eslinkV, ...eslinkV }
}

export { scene, instance }
export default eslinkV
