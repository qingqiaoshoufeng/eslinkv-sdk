import custom from '../store/custom.store.js'

const components = {}; const snapshots = {}
const widgetsObject = []
const conf = require.context('./', true, /\.(component.ts)$/)
const component = require.context('./', true, /index\.(vue)$/)
const snapshot = require.context('./', true, /snapshot\.(jpg|png)$/)
snapshot.keys().forEach(name => {
	const title = name.split('/')[2]
	snapshots[title] = snapshot(name)
})
component.keys().forEach(name => {
	const title = name.split('/')[2]
	components[title] = component(name).default
})
conf.keys().forEach((name, index) => {
	const typeOne = name.split('/')[1]
	const typeTwo = name.split('/')[2]
	const componentConfig = { ...conf(name).value, componentEnTitle: typeTwo }
	const componentAvatar = snapshots[typeTwo]
	if (componentConfig) {
		if (widgetsObject[index]) {
			widgetsObject[index].children.push([{
				componentId: Date.now(),
				componentConfig,
				componentTitle: typeTwo,
				componentEnTitle: typeTwo,
				componentAvatar,
				market: false
			}])
		} else {
			widgetsObject[index] = {
				componentTypeName: typeOne,
				componentTypeEnName: typeOne,
				componentTypeId: typeOne,
				market: false,
				children: [{
					componentId: Date.now(),
					componentConfig,
					market: false,
					componentTitle: typeTwo,
					componentEnTitle: typeTwo,
					componentTypeId: typeTwo,
					componentAvatar
				}]
			}
		}
	}
})
const obj = {
	测: {
		componentTypeName: '测',
		componentTypeEnName: '测',
		componentTypeId: '测',
		market: false,
		children: widgetsObject
	}
}
custom.actions.setCustomComponents(components)
custom.actions.setCustomWidgets(obj)
