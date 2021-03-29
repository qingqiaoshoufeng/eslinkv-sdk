import { level } from '../api/marketComponentType.api'
import { list } from '../api/marketComponent.api'
import custom from '../store/custom.store'

const market = async function () {
	const level0 = await level()
	const widgetsObject = {}
	level0.forEach(item => {
		level({ componentTypeParentId: item.componentTypeId }).then(array => {
			array.forEach(item => {
				list({
					componentTypeId: item.componentTypeId,
					isCurrentVersion: true,
					status: 'SUCCESS',
					pageNum: 1,
					pageSize: 999
				}).then(res => {
					res.list.forEach(m => {
						if (widgetsObject[item.componentTypeEnName]) {
							widgetsObject[item.componentTypeEnName].widgets[m.componentEnTitle] = { ...m, type: m.componentEnTitle, label: m.componentTitle, market: true }
						} else {
							widgetsObject[item.componentTypeEnName] = {
								componentTypeEnName: item.componentTypeEnName,
								componentTypeName: item.componentTypeName,
								children: { [m.componentEnTitle]: { ...m, type: m.componentEnTitle, label: m.componentTitle, market: true } }
							}
						}
					})
				})
			})
		})
		custom.actions.setCustomWidgets({
			componentTypeEnName: item.componentTypeEnName,
			componentTypeName: item.componentTypeName,
			children: widgetsObject
		})
	})
}
export default market

