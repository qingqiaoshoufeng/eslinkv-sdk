<template lang="pug">
i-modal.check-modal(v-model="modalShow", :footer-hide="true")
	p(:style="{ marginBottom: '10px' }") 快生成链接，分享给你的好友吧
	.fn-flex.flex-row(:style="{ marginBottom: '10px' }")
		label.ivu-btn.d-detail-share-button(
			:class="{ 'ivu-btn-primary': shareType === 'ALL' }",
			@click="shareType = 'ALL'") 不限制
		label.ivu-btn.d-detail-share-button(
			:class="{ 'ivu-btn-primary': shareType === 'PASSWORD' }",
			@click="shareType = 'PASSWORD'") 加密分享
		label.ivu-btn.d-detail-share-button(
			:class="{ 'ivu-btn-primary': shareType === 'TIME' }",
			@click="shareType = 'TIME'") 时效分享
	.fn-flex.flex-row(:style="{ marginBottom: '10px' }")
		i-input(
			v-show="shareType === 'PASSWORD'",
			:style="{ width: '150px' }",
			v-model="sharePassword")
			span(slot="prepend") 密钥
		i-input(
			v-show="shareType === 'TIME'",
			:style="{ width: '150px' }",
			@on-keypress="keypressForTime",
			type="number",
			v-model="shareTime")
			span(slot="append") 小时
		i-button(
			type="primary",
			@click="shareSubmit",
			:style="{ marginLeft: '10px' }") 生成
		i-button(
			type="warning",
			v-if="shareUrl",
			@click="closeShare",
			:style="{ marginLeft: '10px' }") 关闭分享
	.deadline(v-if="shareType === 'TIME'") 到期时间：{{ deadline }}
	.fn-flex.flex-row
		i-input(
			search,
			readonly,
			enter-button="复制",
			@on-search="handleCopy",
			v-model="shareUrl")
</template>
<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Modal, Button, Input } from 'view-design'
import shareMx from './share.mx'
import { mixins } from 'vue-class-component'
import platform from '../../store/platform.store'

@Component({
	components: {
		'i-button': Button,
		'i-modal': Modal,
		'i-input': Input,
	},
})
// @ts-ignore
export default class DShareDialog extends mixins(shareMx) {
	@Prop(Boolean) value!: boolean
	@Prop(String) sid?: string
	@Prop({default: false, type: Boolean}) autoInit?: boolean

	screenId = ''
	modalShow = false
	isInit = true
	platform = platform.state

	@Watch('value')
	onValueChange(val) {
		this.modalShow = val
		if (val && this.isInit && !this.autoInit) {
			this.init()
			this.isInit = false
		}
	}

	@Watch('modalShow')
	onModalShow(val) {
		this.$emit('input', val)
	}
}
</script>
<style lang="scss" scoped>
.d-detail-share-button {
	line-height: 32px;
	border-radius: 0;
}
</style>
