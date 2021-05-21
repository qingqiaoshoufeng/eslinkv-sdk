<template lang="pug">
.d-right-modal.d-scrollbar
	d-right-control(label="屏幕大小")
		i-select(v-model="size")
			i-option(value="1920*1080") 大屏推荐尺寸1920*1080
			i-option(value="1366*768") web最常见尺寸1366*768
			i-option(value="1024*768") web最小尺寸1024*768
			i-option(value="other") 自定义
	d-right-control
		d-input(
			append="W",
			v-model="platform.width",
			:style="{ width: '100px' }")
		d-input(
			append="H",
			v-model="platform.height",
			:style="{ marginLeft: '10px', width: '100px' }")
	d-right-control(label="背景色")
		i-color-picker(
			:alpha="true",
			v-model="platform.backgroundColor")
		i-input(
			v-model="platform.backgroundColor",
			:disabled="true",
			:style="{ width: '166px', marginLeft: '10px' }")
	d-right-control(label="背景图", title="支持jpg，png，gif")
		d-upload(
			v-model="platform.backgroundImage",
			:data="backGroundFormData")
	d-right-control(label="移动看板")
		i-switch(v-model="platform.isMobile")
	d-right-control(label="适配模式")
		i-select(v-model="platform.layoutMode")
			i-option(value="full-size") 充满页面
			i-option(value="full-width") 100%宽度
			i-option(value="full-height") 100%高度
	// START_PROD
	d-right-control(label="封面", title="支持jpg，png，gif")
		d-upload(
			v-model="platform.screenAvatar",
			:data="screenAvatarFormData",
			@success="handleScreenAvatar")
	d-right-control
		i-button(@click="screenAvatar", type="primary") 截屏
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

	// START_PROD
	screenAvatarFormData = {
		library: 'screenAvatar',
	}
	// END_PROD

	get size() {
		const width = this.platform.width
		const height = this.platform.height
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
			this.platform.width = +width
			this.platform.height = +height
		}
	}

	// START_PROD
	handleScreenAvatar(res) {
		const {
			params: { id },
		} = this.$route
		this.$api.screen.update({
			screenId: id,
			screenAvatar: res ? res.result.url : '',
		})
	}

	async screenAvatar() {
		const {
			params: { id },
		} = this.$route
		if (id) {
			const screenAvatar = await this.capture({
				selector: '#screen',
			}).catch(e => {
				console.warn(e)
				this.$Message.error('截屏创建失败')
			})
			this.platform.screenAvatar = (screenAvatar as any).url
			this.$api.screen.update({
				screenId: id,
				screenAvatar: (screenAvatar as any).url,
			})
		}
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
			.finally(() => {})
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
}
</script>
