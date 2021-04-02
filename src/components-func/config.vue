<template lang="pug">
.d-manage-modal-control-config
	.d-manage-modal-control
		label 平台版本
		.d-manage-modal-control-right
			span.d-manage-modal-control-text {{ platform.version }}
	.d-manage-modal-control
		label 大屏id
		.d-manage-modal-control-right
			span.d-manage-modal-control-text {{ platform.panelConfig.id }}
	.d-manage-modal-control
		label 大屏名称
		.d-manage-modal-control-right
			i-input(v-model="platform.panelConfig.info.name")
	.d-manage-modal-control
		label 大屏描述
		.d-manage-modal-control-right
			i-input(v-model="platform.panelConfig.info.remark")
	.d-manage-modal-control
		label 常规尺寸
		.d-manage-modal-control-right
			i-select(@on-change="sizeChange")
				i-option(value="1920×1080") 1920×1080
				i-option(value="1600×900") 1600×900
				i-option(value="1366×768") 1366×768
				i-option(value="1080×1920") 1080×1920
				i-option(value="2560×1600") 2560×1600
	.d-manage-modal-control
		label
		.d-manage-modal-control-right
			i-input-number(
				:min="1",
				:step="1",
				:formatter="value => `w:${value}`",
				v-model="platform.panelConfig.size.width",
				:style="{ marginRight: '10px' }"
				:parser="value => value.replace('w:', '')")
			i-input-number(
				:min="1",
				:step="1",
				:formatter="value => `h:${value}`",
				v-model="platform.panelConfig.size.height",
				:style="{ marginRight: '10px' }"
				:parser="value => value.replace('h:', '')")
			i-select(v-model="platform.panelConfig.size.unit", :style="{ width: '60px' }")
				i-option(value="px") px
				i-option(value="%") %
				i-option(value="vw/vh") vw/vh
	.d-manage-modal-control
		label 背景色
		.d-manage-modal-control-right
			i-colorPicker(
				:alpha="true",
				v-model="platform.panelConfig.background.color")
	.d-manage-modal-control
		label 背景图片
		.d-manage-modal-control-right
			d-upload(
				v-model="platform.panelConfig.background.url",
				:data="backGroundFormData")
	.d-manage-modal-control
		label
		.d-manage-modal-control-right
			i-select(v-model="platform.panelConfig.background.repeat")
				i-option(value="repeat") repeat
				i-option(value="no-repeat") no-repeat
				i-option(value="repeat-x") repeat-x
				i-option(value="repeat-y") repeat-y
				i-option(value="space") space
				i-option(value="round") round
	.d-manage-modal-control
		label
		.d-manage-modal-control-right
			i-select(
				v-model="platform.panelConfig.background.size",
				:style="{ marginRight: '10px' }")
				i-option(value="cover") cover
				i-option(value="contain") contain
				i-option(value="auto") auto
			i-input(v-model="platform.panelConfig.background.size")
	.d-manage-modal-control
		label
		.d-manage-modal-control-right
			i-select(
				v-model="platform.panelConfig.background.position",
				:style="{ marginRight: '10px' }")
				i-option(value="center") center
				i-option(value="left") left
				i-option(value="right") right
				i-option(value="top") top
				i-option(value="bottom") bottom
			i-input(v-model="platform.panelConfig.background.position")
	.d-manage-modal-control
		label 移动看板
		.d-manage-modal-control-right
			i-switch(v-model="platform.panelConfig.size.isMobileKanboard")
	.d-manage-modal-control(v-if="platform.panelConfig.size.isMobileKanboard")
		label
		.d-manage-modal-control-right
			i-select(
				v-model="platform.panelConfig.size.deviceType",
				:style="{ marginRight: '10px' }")
				i-option(value="mobile") 手机
				i-option(value="pad") 平板
			i-select(v-model="platform.panelConfig.size.layoutMode")
				i-option(value="full-size") 充满页面
				i-option(value="full-width") 100%宽度
				i-option(value="full-height") 100%高度
	.d-manage-modal-control
		label 封面
		.d-manage-modal-control-right
			d-upload(
				v-model="platform.screenAvatar",
				:data="screenAvatarFormData",
				@success="handleScreenAvatar")
	.d-manage-modal-control
		label
		.d-manage-modal-control-right
			i-button(@click="screenAvatar", type="primary") 截屏
	.d-manage-modal-control
		label 自动贴靠参考线
		.d-manage-modal-control-right
			i-switch(v-model="platform.autoAlignGuide")
</template>
<script lang="ts">
import func from './func.mx'
import { Component } from 'vue-property-decorator'
import html2canvas from 'html2canvas'
import platform from '../store/platform.store.js'
import dUpload from '../components/d-upload'

@Component({
	components: {
		dUpload,
	},
})
export default class FuncConfig extends func {
	platform = platform.state
	backGroundFormData = {
		library: 'componentBackGround',
	}

	screenAvatarFormData = {
		library: 'screenAvatar',
	}

	handleScreenAvatar(screenAvatar) {
		const {
			params: { id },
		} = this.$route
		this.$api.screen.update({
			screenId: id,
			screenAvatar,
		})
	}

	sizeChange(value) {
		if (value === undefined) return
		if (value) {
			const [width, height] = value.split('×')
			if (width !== 'null') this.platform.panelConfig.size.width = +width
			if (height !== 'null')
				this.platform.panelConfig.size.height = +height
		} else {
			this.platform.panelConfig.size.width = 1920
			this.platform.panelConfig.size.height = 1080
		}
	}

	async screenAvatar() {
		const {
			params: { id },
		} = this.$route
		if (id) {
			const screenAvatar = await this.capture({
				selector: '#kanban',
			}).catch(e => {
				this.$Message.error('截屏创建失败')
			})
			this.platform.screenAvatar = screenAvatar.url
			this.$api.screen.update({
				screenId: id,
				screenAvatar: screenAvatar.url,
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
			html2canvas(node, {
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
}
</script>
