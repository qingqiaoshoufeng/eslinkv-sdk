import { getLevel } from '../api/marketComponentType.api'
import { list } from '../api/marketComponent.api'
import custom from '../store/custom.store'

let widgetsArray = []

getLevel().then(res => {
	res.forEach(child => {
        list({
            componentTypeId: child.componentTypeId,
            isCurrentVersion: true,
            status: 'SUCCESS',
            pageNum: 1,
            pageSize: 999
        }).then(res => {
			widgetsArray = res.list
			custom.actions.setCustomWidgets({
				label: child.componentTypeName,
				widgets: widgetsArray
			})
		})
	})
})
