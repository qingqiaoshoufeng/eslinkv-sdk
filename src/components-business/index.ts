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
conf.keys().forEach(name => {
	const type = name.split('/')[1]
	const title = name.split('/')[2]
	const obj = { config: { layout: conf(name).value ? conf(name).value.layout : {} } }
	const componentAvatar = snapshots[title] || 'https://via.placeholder.com/150'
	if (obj) {
		if (widgetsObject[type]) {
			widgetsObject[type].widgets = [{ id: title, ...obj, componentType: title, label: title, componentAvatar }]
		} else {
			widgetsObject[type] = {
				type,
				label: type,
				widgets: { [title]: { ...obj, type: title, label: title, componentAvatar } }
			}
		}
	}
})

custom.actions.setCustomComponents(components)
custom.actions.setCustomWidgets({
	label: '杭燃样式',
	widgets: widgetsObject
})
