<template lang="pug">
	d-right-modal.d-widget-modal(title="小工具清单" :width="360" icon="ios-apps" :top="107")
		header.fn-flex.flex-row
			i-input(:value="scene.obj[scene.index].name" @on-change="handleSceneName" v-if="editScene")
				i-icon(type="md-checkmark" slot="suffix" @click="editScene=false")
			i-select(v-model="scene.index" v-if="!editScene")
				i-option(:value="0") 主场景
				i-option(:value="key" v-for="(item,key) in scene.obj" :key="key") {{item.name}}
				i-option(:value="-1") 场景回收站
			i-dropdown(@on-click="handleSetScene" v-if="!editScene")
				a
					span {{have}}/{{total}} 设置
					i-icon(type="ios-arrow-down")
				i-dropdown-menu(slot="list")
					i-dropdown-item(name="copy")
						span 复制场景ID
					i-dropdown-item(name="create")
						span 新增场景
					i-dropdown-item(name="edit" :disabled="scene.index===0")
						span 编辑场景
					i-dropdown-item(name="destroy")
						span 删除场景
		ul.d-scrollbar.d-widget-list
			li.pointer.pos-r(v-for="item in list" :class="[{active:platform.chooseWidgetId===item.id}]" :key="item.id" @click="handleChoose(item.id)")
				.fn-flex.flex-row
					.d-widget-left
						.fn-flex.flex-column
							.fn-flex-row
								i-icon(:type="`md-eye${item.config.widget.hide ? '-off' : ''}`" :title="!item.config.widget.hide ? '隐藏' : '显示'" @click="handleTaggerHide(item.id)" @click.stop)
								i-icon(:type="`md-${item.config.widget.locked ? '' : 'un'}lock`" :title="!item.config.widget.locked ? '锁定' : '解锁'" @click="handleTaggerLock(item.id)" @click.stop)
								i-icon(type="md-trash" title="删除" @click="handleDelete(item.id)" @click.stop)
							h2 {{item.type}}
					.d-widget-middle
						.fn-flex.flex-column
							h3 TYPE: {{item.config.widget.name}}
							p ID: {{item.id}}
					.d-widget-right.fn-flex.flex-column
						i-icon(type="ios-arrow-dropup" @click="handleUpZIndex(item.id)" @click.stop)
						span {{item.config.layout.zIndex}}
						i-icon(type="ios-arrow-dropdown" @click="handleDownZIndex(item.id)" @click.stop)
		i-modal(v-model="copyModel" title="提示" :footer-hide="true")
			.fn-flex.flex-row
				span.fn-hide.copy-id {{scene.index}}
				i-input(v-model="scene.index" search readonly enter-button="复制" @on-search="handleCopy")
</template>
<script lang="ts">
	import dRightModal from '../d-right-modal/index.vue'
	import { Component, Vue } from 'vue-property-decorator'
	import { Icon, Input, Select, Option, DropdownMenu, DropdownItem, Dropdown, Modal, Button } from 'view-design'
	import scene from '../../store/scene.store'
	import platform from '../../store/platform.store'
	import { copyText } from '../../utils/index'

	@Component({
		components: {
			dRightModal,
			'i-icon': Icon,
			'i-modal': Modal,
			'i-input': Input,
			'i-select': Select,
			'i-option': Option,
			'i-button': Button,
			'i-dropdown-menu': DropdownMenu,
			'i-dropdown-item': DropdownItem,
			'i-dropdown': Dropdown
		}
	})
	export default class DRightWidget extends Vue {
		scene: any = scene.state
		platform: any = platform.state
		total: nunber = 0
		have: nunber = 0
		editScene = false
		copyModel = false

		get list () {
			const list = []; let total = 0; let have = 0
			for (const key in this.platform.widgetAdded) {
				total++
				const item = this.platform.widgetAdded[key]
				if (item.scene === this.scene.index) {
					list.push(item)
					have++
				}
			}
			this.total = total
			this.have = have
			return list
		}

		handleUpZIndex (id) {
			this.platform.widgetAdded[id].config.layout.zIndex++
		}

		handleDownZIndex (id) {
			this.platform.widgetAdded[id].config.layout.zIndex--
		}

		handleSetScene (name) {
			switch (name) {
				case 'create':
					this.createScene()
					break
				case 'edit':
					this.editScene = true
					break
				case 'destroy':
					this.destroyScene()
					break
				case 'copy':
					this.copyModel = true
					break
			}
		}

		handleChoose (id) {
			this.platform.chooseWidgetId = id
			this.$emit('handleActivated', id)
		}

		handleCopy () {
			copyText(this.scene.index)
		}

		handleDelete (id) {
			this.$Modal.confirm({
				title: '提示',
				content: '是否删除当前组件？',
				onOk: () => {
					this.$delete(this.platform.widgetAdded, id)
					this.platform.chooseWidgetId = null
				}
			})
		}

		handleTaggerHide (id) {
			this.platform.widgetAdded[id].config.widget.hide = !this.platform.widgetAdded[id].config.widget.hide
		}

		handleTaggerLock (id) {
			this.platform.widgetAdded[id].config.widget.locked = !this.platform.widgetAdded[id].config.widget.locked
		}

		createScene () {
			scene.actions.createScene()
		}

		handleSceneName (e) {
			scene.actions.setSceneName(this.scene.index, e.target.value)
		}

		destroyScene () {
			this.$Modal.confirm({
				title: '提示',
				content: '是否删除当前场景？该场景未删除的组件将自动进入场景回收站！',
				onOk: () => {
					const index = this.scene.index
					scene.actions.setSceneIndex(0)
					scene.actions.deleteScene(index)
					for (const key in this.platform.widgetAdded) {
						const item = this.platform.widgetAdded[key]
						if (item.scene === index) {
							item.scene = -1
						}
					}
				}
			})
		}
	}
</script>
<style lang="scss" scoped>
	@import "../../../src/scss/conf";

	.d-widget-list {
		li {
			align-items: center;
			justify-content: center;
			height: 60px;
			padding: 10px;
			margin: 10px 0;
			font-size: 12px;
			border: 1px solid #ddd;
			transition: all 0.3s;

			/deep/ {
				.ivu-input {
					font-size: 12px;
				}
			}

			h3,
			p {
				font-size: 12px;
				font-weight: normal;
			}

			h2 {
				font-size: 14px;
				font-weight: normal;
			}

			&.active {
				color: #fff;
				background-color: $themeColor;
				border-color: $themeColor;
			}

			&:hover {
				border-color: $themeColor;
			}
		}
	}

	.d-widget-modal {
		ul {
			height: calc(100% - 42px);
			overflow-y: auto;
		}

		header {
			flex: 0 0 auto;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			height: 42px;
			font-size: 14px;
			font-weight: bold;
			line-height: 42px;
			border-bottom: 1px solid $borderColor;

			.ivu-select {
				width: 180px;
			}

			span {
				margin-left: auto;
			}
		}

		.d-widget-left,
		.d-widget-middle,
		.d-widget-right {
			align-items: center;
		}

		.d-widget-left {
			width: 150px;

			.ivu-icon {
				margin-right: 4px;
				font-size: 14px;

				&:hover {
					color: $themeColor;
				}
			}
		}

		.d-widget-right {
			justify-content: center;
			margin-left: auto;
			font-weight: bold;
		}
	}
</style>
