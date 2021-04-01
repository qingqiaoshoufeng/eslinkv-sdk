<template lang="pug">
  .d-upload
    .d-upload-img.pos-r(v-if="value")
      img(:src="value")
      i-upload.pointer.pos-a(:action="action" :data="data"
        :on-success="handleSuccess")
      i-icon.d-upload-download-icon.pos-a.pointer(title="下载" type="ios-download-outline" color="#fff" size="14" @click="handleDown")
      i-icon.d-upload-remove-icon.pos-a.pointer(title="删除" type="ios-trash-outline" color="#fff" size="14" @click="handleRemove")
    i-upload.pointer(v-else :action="action" :data="data"
      :on-success="handleSuccess")
      .d-upload-text 点击上传
</template>
<script lang="ts">
	import { baseURL } from '../../../src/api/request.js'
	import platform from '../../../src/store/platform.store.js'
	import { Component, Vue, Prop } from 'vue-property-decorator'
	import { Upload, Icon } from 'view-design'
  @Component({
    components: {
      'i-upload': Upload,
      'i-icon': Icon
    }
  })
	export default class DUpload extends Vue {
    platform = platform.state

    @Prop({ default: `${baseURL}/upload/file` }) action
    @Prop() data
    @Prop() value

    handleDown () {
      const a = document.createElement('a')
      a.setAttribute('download', this.value)
      a.setAttribute('href', this.value)
      a.click()
    }

    handleRemove () {
      this.$emit('input', '')
      this.$emit('success', '')
    }

		handleSuccess (res) {
      this.$emit('input', res.result.url)
			this.$emit('success', res)
		}
	}
</script>
<style lang="scss" scoped>
@import "src/scss/conf";
.d-upload-download-icon{
  right: 30px;
  top: 10px;
}
.d-upload-remove-icon{
  right: 10px;
  top: 10px;
}
.d-upload-img {
  width: 208px;
  height: 115px;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
  }
}
.d-upload {
  border: 1px solid #393b4a;
  &:hover {
    border: 1px solid $themeColor;

    .d-upload-text {
      color: $themeColor;
    }
  }
  &::v-deep{
    .ivu-upload-select {
      width: 208px;
      height: 115px;
      transition: all .3s;
      display: flex;
      display: -webkit-flex;
      align-items: center;
      justify-content: center;

      .d-upload-text {
        font-size: 14px;
      }
    }
  }
}
</style>
