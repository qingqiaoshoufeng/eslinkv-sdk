import { level } from '../api/marketComponentType.api'
import custom from '../store/custom.store'

const market = async function () {
	const level0 = await level()
	const widgetsObject = {}
	level0.forEach(item => {
		level({ componentTypeParentId: item.componentTypeId }).then(array => {
			if (array.length > 0) {
				widgetsObject[item.componentTypeId] = {
					...item,
					market: true,
					children: [],
				}
			}
			array.forEach(child => {
				widgetsObject[item.componentTypeId].children.push({
					...child,
					market: true,
				})
			})
			custom.actions.setCustomWidgets(widgetsObject)
		})
	})
}

export default market
