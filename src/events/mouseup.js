import event from '@/store/event.store'
import ruler from '@/store/ruler.store'
import platform from '@/store/platform.store'

/**
 * @description
 * DOM : document
 * 事件： mouseup
 */
const mouseup = () => {
	if (event.state.contentDrag) {
		event.state.contentDrag = false
	}
	if (event.state.kuangMove) {
		const kuang = document.getElementById('d-kuang')
		const dr = document.getElementsByClassName('dr')
		const selectedEls = []
		kuang.style.display = 'none'
		event.state.kuangMove = false
		let l = Number(kuang.style.left.replace('px', ''))
		l =
			(l -
				ruler.state.size -
				ruler.state.xRoomL1 -
				ruler.state.xRoomL2 -
				ruler.state.guideStartX) /
			ruler.state.zoom
		let t = Number(kuang.style.top.replace('px', ''))
		t =
			(t -
				ruler.state.size -
				ruler.state.yRoom -
				ruler.state.guideStartY) /
			ruler.state.zoom
		let w = Number(kuang.style.width.replace('px', ''))
		w = w / ruler.state.zoom
		let h = Number(kuang.style.height.replace('px', ''))
		h = h / ruler.state.zoom
		for (let i = 0; i < dr.length; i++) {
			const transform = dr[i].style.transform
			if (transform) {
				const tran = transform.split(/\(|\)/)[1].split(',')
				const left = Number(tran[0].replace('px', ''))
				const top = Number(tran[1].replace('px', ''))
				const width = dr[i].offsetWidth
				const height = dr[i].offsetHeight
				if (
					l < left &&
					left + width < l + w &&
					t < top &&
					top + height < t + h
				) {
					selectedEls.push(dr[i].getAttribute('data-id'))
				}
			}
		}
		if (selectedEls.length === 1) {
			platform.state.chooseWidgetId = selectedEls[0]
			platform.state.chooseWidgetState = false
		}
	}
	if (event.state.componentMove) {
		event.state.componentMove = false
	}
}
export default mouseup
