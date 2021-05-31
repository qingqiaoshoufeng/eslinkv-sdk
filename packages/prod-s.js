import scene from '../src/store/scene.store'
import instance from '../src/store/instance.store'
import custom from '../src/store/custom.store'
import event from '../src/store/event.store.js'

const eslinkV = {
	scene,
	instance,
	custom,
	event,
}
if (window !== undefined) {
	if (!window.eslinkV) {
		window.eslinkV = {}
	}
	window.eslinkV = { ...window.eslinkV, ...eslinkV }
}

export { scene, instance, custom, event }
export default eslinkV
