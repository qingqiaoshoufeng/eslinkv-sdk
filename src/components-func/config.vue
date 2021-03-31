<template lang="pug">
  .d-manage-modal-control-config
    .d-manage-modal-control
      label 大屏id
      .d-manage-modal-control-right
        i-input(v-model="platform.panelConfig.id" :disabled="true")
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
      .d-manage-modal-control-right.fn-flex.flex-row
        i-input-number(:min="1" :step="1" :formatter="value => `${value} w`"
          v-model="platform.panelConfig.size.width" :style="{marginRight:'10px'}")
        i-input-number(:min="1" :step="1" :formatter="value => `${value} h`"
          v-model="platform.panelConfig.size.height" :style="{marginRight:'10px'}")
        i-select(v-model="platform.panelConfig.size.unit" :style="{width:'60px'}")
          i-option(value="px") px
          i-option(value="%") %
          i-option(value="vw/vh") vw/vh
    .d-manage-modal-control
      label 背景色
      .d-manage-modal-control-right
        i-colorPicker(:alpha="true" v-model="platform.panelConfig.background.color")
    .d-manage-modal-control
      label 背景图片
      .d-manage-modal-control-right
        .d-manage-modal-background.pos-r(:style="{marginBottom:'10px'}")
          img(:src="platform.panelConfig.background.url" v-if="platform.panelConfig.background.url" :style="{maxWidth:'100%',maxHeight:'270px'}")
          i-icon.pos-a.pointer(type="md-trash" color="#fff" :size="20" @click="handleImgRemove")
        i-upload(:action="action" :data="formData" :on-success="handleImgSuccess" :on-preview="handleImgPreview")
          i-button(icon="ios-cloud-upload-outline") 上传图片
    .d-manage-modal-control
      label
      .d-manage-modal-control-right.fn-flex
        i-select(v-model="platform.panelConfig.background.repeat")
          i-option(value="repeat") repeat
          i-option(value="no-repeat") no-repeat
          i-option(value="repeat-x") repeat-x
          i-option(value="repeat-y") repeat-y
          i-option(value="space") space
          i-option(value="round") round
    .d-manage-modal-control
      label
      .d-manage-modal-control-right.fn-flex
        i-select(v-model="platform.panelConfig.background.size" :style="{marginRight:'10px'}")
          i-option(value="cover") cover
          i-option(value="contain") contain
          i-option(value="auto") auto
        i-input(v-model="platform.panelConfig.background.size")
    .d-manage-modal-control
      label
      .d-manage-modal-control-right.fn-flex
        i-select(v-model="platform.panelConfig.background.position" :style="{marginRight:'10px'}")
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
      .d-manage-modal-control-right.fn-flex
        i-select(v-model="platform.panelConfig.size.deviceType" :style="{marginRight:'10px'}")
          i-option(value="mobile") 手机
          i-option(value="pad") 平板
        i-select(v-model="platform.panelConfig.size.layoutMode")
          i-option(value="full-size") 充满页面
          i-option(value="full-width") 100%宽度
          i-option(value="full-height") 100%高度
</template>
<script lang="ts">
	import func from './func.mx'
	import { Component } from 'vue-property-decorator'
	import { baseURL } from '../api/request.js'
	@Component
	export default class FuncConfig extends func {
    action=`${baseURL}/upload/file`

    get formData () {
      return {
        library: 'componentBackGround'
      }
    }

    handleImgRemove () {
      this.$Modal.confirm({
        title: '是否删除背景图',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.platform.panelConfig.background.url = ''
        }
      })
    }

    handleImgPreview (file) {
      this.platform.panelConfig.background.url = file.url
    }

    handleImgSuccess (res, file) {
      file.url = res.result.url
      this.platform.panelConfig.background.url = res.result.url
    }

		sizeChange (value) {
			if (value === undefined) return
			if (value) {
				const [width, height] = value.split('×')
				if (width !== 'null') this.platform.panelConfig.size.width = +width
				if (height !== 'null') this.platform.panelConfig.size.height = +height
			} else {
				this.platform.panelConfig.size.width = 1920
				this.platform.panelConfig.size.height = 1080
			}
		}
	}
</script>
<style lang="scss" scoped>
.d-manage-modal-background {
	&:hover {
		img {
			filter: grayscale(100%);
		}

		&::v-deep {
			.ivu-icon {
				opacity: 1;
			}
		}
	}

	img {
		transition: all 0.3s;
	}

	&::v-deep {
		.ivu-icon {
			top: 50%;
			left: 50%;
			margin-top: -10px;
			margin-left: -10px;
			opacity: 0;
		}
	}
}
</style>
