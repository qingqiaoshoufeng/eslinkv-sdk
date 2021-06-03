import scene from '../src/store/scene.store'
import instance from '../src/store/instance.store'
import custom from '../src/store/custom.store'

const eslinkV = {
	scene,
	instance,
	custom,
}
if (window !== undefined) {
	if (!window.eslinkV) {
		window.eslinkV = {}
	}
	window.eslinkV = { ...window.eslinkV, ...eslinkV }
}

export { scene, instance, custom }
export default eslinkV
