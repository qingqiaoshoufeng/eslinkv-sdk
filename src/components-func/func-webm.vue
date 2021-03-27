<template lang="pug">
  .d-manage-modal-control
    label {{config.label}}
    .webms
      video(
        v-for="(k, i) in config.options"
        :key="i"
        :src="k"
        @click="pick(k)"
        autoplay="autoplay"
        muted="muted"
        loop
        :class="{active: k === obj[inputKey]}"
      )
    i-upload(:action="action" :data="formData" :on-success="handleSuccess" :on-preview="handlePreview")
      i-button(icon="ios-cloud-upload-outline") 上传图片
</template>
<script lang="ts">
	import func from './func.mx'
	import { Component } from 'vue-property-decorator'
	import { Button, Upload } from 'view-design'
	import { baseURL } from '../api/request.js'

	@Component({
    components: {
      'i-upload': Upload,
      'i-button': Button
    }
  })
	export default class FuncWebm extends func {
    action=`${baseURL}/upload/file`
		get formData () {
			return {
				library: `componentStatic/${this.item.type}/${this.item.config.widget.componentVersion}`
			}
		}

		handlePreview (file) {
			this.obj[this.inputKey] = file.url
		}

		handleSuccess (res, file) {
			file.url = res.result.url
			this.obj[this.inputKey] = res.result.url
		}

		pick (webm) {
			this.obj[this.inputKey] = webm
		}
	}
</script>
<style lang="scss" scoped>
	.webms {
		video {
			width: 50px;
			margin-right: 10px;
			border: 1px solid transparent;

			&.active {
				border: 1px solid #464f5c;
			}
		}
	}
</style>
