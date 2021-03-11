import { getCompList, getLevel0 } from '../api/bussiness.api'
import custom from '../store/custom.store'

let widgetsArray = []

getLevel0().then(res => {
	res.forEach(child => {
		getCompList({ componentTypeId: child.componentTypeId }).then(res => {
			widgetsArray = res
			custom.actions.setCustomWidgets({
				label: child.componentTypeName,
				widgets: widgetsArray
			})
		})
	})
})
