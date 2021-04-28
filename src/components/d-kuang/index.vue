<template></template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import platform from '../../store/platform.store.js'
import event from '../../store/event.store.js'

@Component
export default class DKuang extends Vue {
	startX = 0 // 用来存放鼠标点击初始位置
	startY = 0
	platform = platform.state
	event = event.state

	mouseupHandle() {
		// 恢复参数
		if (this.event.kuangMove) {
			const selDiv = document.getElementById('d-kuang')
			selDiv.style.display = 'none'
			this.event.kuangMove = false
		}
	}

	mounted() {
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
