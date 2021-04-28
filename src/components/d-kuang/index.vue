<template></template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import platform from '../../store/platform.store.js'
import event from '../../store/event.store.js'

@Component
export default class DKuang extends Vue {
	startX = 0 // 用来存放鼠标点击初始位置
	startY = 0
	mouseOn = false // 是否开启框选功能
	platform = platform.state
	event = event.state

	mousedownHandle(e) {
		e.stopPropagation()
		// 判断是否为鼠标左键被按下
		if (e.buttons !== 1 || e.which !== 1) return
		if (this.event.contentMove) return
		if (this.event.componentDrag) return
		this.mouseOn = true
		this.startX = e.clientX
		this.startY = e.clientY
		// 创建一个框选元素
		const selDiv = document.createElement('div')
		// 给框选元素添加css样式，这里使用绝对定位
		selDiv.style.cssText =
			'position: absolute;width: 0;height: 0;margin: 0;padding: 0;border: 1px solid rgb(36, 145, 247);background-color: rgba(0, 132, 255, 0.15);z-index: 1000;opacity: 0.6;display: none;pointer-events: none;'
		selDiv.id = 'd-kuang'
		document.body.appendChild(selDiv)
		// 根据起始位置，添加定位
		selDiv.style.left = this.startX + 'px'
		selDiv.style.top = this.startY + 'px'
	}

	mousemoveHandle(e) {
		// 如果并非框选开启，退出
		if (!this.mouseOn) return
		e.stopPropagation()
		// 处理鼠标移动
		const _x = e.clientX
		const _y = e.clientY
		// 根据坐标给选框修改样式
		const selDiv = document.getElementById('d-kuang')
		selDiv.style.display = 'block'
		selDiv.style.left = Math.min(_x, this.startX) + 'px'
		selDiv.style.top = Math.min(_y, this.startY) + 'px'
		selDiv.style.width = Math.abs(_x - this.startX) + 'px'
		selDiv.style.height = Math.abs(_y - this.startY) + 'px'
		// 如果需要更直观一点的话，我们还可以在这里进行对框选元素覆盖到的元素进行修改被框选样式的修改。
	}

	mouseupHandle(e) {
		const selDiv = document.getElementById('d-kuang')
		// 恢复参数
		selDiv.style.display = 'none'
		this.mouseOn = false
	}

	mounted() {
		// 添加鼠标按下监听事件
		document
			.getElementById('d-editor')
			.addEventListener('mousedown', this.mousedownHandle)
		// 添加鼠标移动事件监听
		document
			.getElementById('d-editor')
			.addEventListener('mousemove', this.mousemoveHandle)
		// 添加鼠标点击松开事件监听
		document
			.getElementById('d-editor')
			.addEventListener('mouseup', this.mouseupHandle)
	}
}
</script>
<style lang="scss" scoped>
.d-kuang {
}
</style>
