<template lang="pug">
.d-upload
	.d-upload-img.pos-r
		img(:src="value", v-if="value && type === 'img'")
		video(:src="value", v-if="value && type === 'video'", loop, autoplay)
		.progress(v-if="isShowProgress")
			i-progress(:percent="percent" text-inside :stroke-width="16" status="active")
		i-upload.pointer.pos-a(
			:action="action",
			:data="data",
			:on-progress="handleProgress",
			:show-upload-list="false",
			:before-upload="handleBeforeUpload",
			:on-success="handleSuccess")
			.d-upload-text(v-if="!value && !isShowProgress") 点击上传
		i-icon.d-upload-download-icon.pos-a.pointer(
			v-if="value",
			title="下载",
			type="ios-download-outline",
			color="#fff",
			size="14",
			@click="handleDown")
		i-icon.d-upload-remove-icon.pos-a.pointer(
			v-if="value",
			title="删除",
			type="ios-trash-outline",
			color="#fff",
			size="14",
			@click="handleRemove")
</template>
<script lang="ts">
import { baseURL } from '../../../src/api/request.js'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Upload, Icon, Progress } from 'view-design'
@Component({
	components: {
		'i-upload': Upload,
		'i-icon': Icon,
		'i-progress': Progress,
	},
})
export default class DUpload extends Vue {
	@Prop({ default: `${baseURL}/upload/file` }) action
	@Prop() data
	@Prop({ default: 'img' }) type
	@Prop() value

	percent = 0
	isShowProgress = false

	handleDown() {
		const a = document.createElement('a')
		a.setAttribute('download', this.value)
		a.setAttribute('href', this.value)
		a.click()
	}

	handleRemove() {
		this.$emit('input', '')
		this.$emit('success', '')
	}

	handleSuccess(res) {
		this.isShowProgress = false
		this.$emit('input', res.result.url)
		this.$emit('success', res)
	}
	
	handleProgress (event, file, fileList) {
		console.log(event, file, fileList)
		this.percent = event.percent
	}

	handleBeforeUpload (file) {
		if (this.type === 'img') {
			if (file.size > 1024 * 1024) {
				this.$Message.error('图片大小不能超过1M')
				return false
			} else if (['image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
				this.$Message.error('图片仅支持jpg，png，gif')
			}
		}
		this.isShowProgress = true
		return true
	}
}
</script>
<style lang="scss" scoped>
.d-upload-download-icon {
	top: 10px;
	right: 30px;
}

.d-upload-remove-icon {
	top: 10px;
	right: 10px;
}

.d-upload-img {
	display: flex;
	display: -webkit-flex;
	align-items: center;
	justify-content: center;
	width: 208px;
	height: 115px;
	video,
	img {
		max-width: 100%;
		max-height: 100%;
	}
}

.d-upload {
	border: 1px solid #393b4a;

	&:hover {
		border: 1px solid var(--themeColor);

		.d-upload-text {
			color: var(--themeColor);
		}
	}

	&::v-deep {
		.ivu-upload-select {
			display: flex;
			display: -webkit-flex;
			align-items: center;
			justify-content: center;
			width: 208px;
			height: 115px;
			transition: all 0.3s;

			.d-upload-text {
				font-size: 14px;
			}
		}
	}
}

.progress {
	width: 80%;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	line-height: 1;
}
</style>
