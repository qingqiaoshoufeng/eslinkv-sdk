<template lang="pug">
.d-right-modal.d-scrollbar
	d-right-control(label="屏幕大小")
		i-select(v-model="size")
			i-option(value="1920*1080") 大屏推荐尺寸1920*1080
			i-option(value="1366*768") web最常见尺寸1366*768
			i-option(value="1024*768") web最小尺寸1024*768
			i-option(value="other") 自定义
	d-right-control
		d-input(append="W", v-model="screen.width", :style="{ width: '100px' }")
		d-input(
			append="H",
			v-model="screen.height",
			:style="{ marginLeft: '10px', width: '100px' }")
	d-right-control(label="背景色")
		i-color-picker(
			:alpha="true",
			v-model="screen.backgroundColor",
			v-if="screen.backgroundColor")
		i-input(
			v-model="screen.backgroundColor",
			:disabled="true",
			:style="{ width: '166px', marginLeft: '10px' }")
	d-right-control(label="背景图", title="支持jpg，png，gif")
		d-upload(v-model="screen.backgroundImage", :data="backGroundFormData")
	d-right-control(label="适配模式")
		i-select(v-model="screen.layoutMode")
			i-option(value="full-size") 充满页面
			i-option(value="full-width") 100%宽度
			i-option(value="full-height") 100%高度
	// START_PROD
	d-right-control(label="封面", title="支持jpg，png，gif")
		d-upload(v-model="screen.avatar", :data="screenAvatarFormData")
	d-right-control
		i-button(
			@click="screenAvatar",
			type="primary",
			:loading="screenAvatarLoading") 截屏
	// END_PROD
	d-right-control(label="首场景", v-if="scene.list.length > 0")
		i-select(filterable, v-model="platform.mainScene")
			i-option(:value="0") 主场景
			i-option(:value="key", v-for="(item, key) in scene.obj", :key="key") {{ item.name }}
</template>
<script lang="ts">
import func from '@/components-func/func.mx'
import { Component } from 'vue-property-decorator'
// START_PROD
import html2canvas from 'html2canvas'
// END_PROD
import platform from '@/store/platform.store.js'
import scene from '@/store/scene.store.js'
import dUpload from '@/components-right/d-upload/index.vue'
import { Tooltip } from 'view-design'
import ScreenPc from '@/controller/Screen/pc'
@Component({
	components: {
		dUpload,
		'i-tooltip': Tooltip,
	},
})
export default class FuncConfig extends func {
	platform = platform.state
	scene = scene.state
	backGroundFormData = {
		library: 'componentBackGround',
	}
	screen = {}
	screenAvatarFormData = {
		library: 'screenAvatar',
	}
	screenAvatarLoading = false

	get size() {
		const width = this.screen.width
		const height = this.screen.height
		if (width !== 1920 && width !== 1366 && width !== 1024) {
			return 'other'
		}
		if (height !== 1080 && height !== 768) {
			return 'other'
		}
		return `${width}*${height}`
	}

	set size(value) {
		if (value !== 'other' && value) {
			const [width, height] = value.split('*')
			this.screen.width = +width
			this.screen.height = +height
		}
	}

	// START_PROD
	async screenAvatar() {
		this.screenAvatarLoading = true
		this.capture({
			selector: '#screen',
		})
			.then(res => {
				this.screenAvatarLoading = false
				this.screen.avatar = (res as any).url
			})
			.catch(e => {
				console.warn(e)
				this.screenAvatarLoading = false
				this.$Message.error('截屏创建失败')
			})
	}

	/**
	 * 快照上传
	 */
	upload(blob, resolve, reject) {
		const name = `screenShot-${Date.now()}.jpg`
		const data = new FormData()
		data.append('file', blob, name)
		data.append('library', 'screenAvatar')
		this.$api.upload
			.file(data)
			.then(data => {
				resolve(data)
			})
			.catch(reject)
	}

	/**
	 * 请求创建快照
	 */
	capture({ selector, returnSource = false, options = {} }) {
		return new Promise((resolve, reject) => {
			html2canvas(document.querySelector(selector), {
				allowTaint: true,
				scale: 1,
				useCORS: true,
				...options,
			})
				.then(canvas => {
					try {
						if (!returnSource) {
							canvas.toBlob(
								blob => {
									this.upload(blob, resolve, reject)
								},
								'image/jpeg',
								0.9,
							)
						} else {
							resolve(canvas.toDataURL('image/jpeg', 0.9))
						}
					} catch (e) {
						if (e.message.indexOf('Tainted canvases') > -1) {
							this.$Message.warning('外部素材可能导致截屏异常')
						}
						reject(e)
					}
				})
				.catch(error => {
					reject(error)
				})
		})
	}

	saveSnapshot() {
		const nodes = document.querySelectorAll('.widget-part')
		nodes.forEach(node => {
			html2canvas(node as HTMLElement, {
				allowTaint: true,
				scale: 1,
				useCORS: true,
				backgroundColor: 'transparent',
			}).then(canvas => {
				const link = document.createElement('a')
				link.href = canvas.toDataURL()
				link.setAttribute('download', 'screenAvatar.png')
				link.style.display = 'none'
				document.body.appendChild(link)
				link.click()
			})
		})
	}
	// END_PROD

	mounted() {
		this.screen = ScreenPc.getInstance()
	}
}
</script>
