<template lang="pug">
	.widgets-panel(:class="{ fixed: panelFixed }")
		i-tabs(:animated="false" type="card" @on-click="(name) => handlePanelToggle(name)")
			template(v-for="(tab,tabKey) in custom.widgets")
				i-tab-pane(:key="tab.name" :label="tab.label" :name="tab.name")
					i-collapse(accordion simple @on-change="(keys) => handlePanelToggle(tab.name, keys[0])")
						i-panel(:key="type" :name="type" :activeSet="setActiveMap(tab.name, type)" v-for="{ label, type, widgets } in tab.widgets")
							span {{ label }}
							template(v-if="widgetListActiveMap[`${tab.name}-${format(type)}`]" slot="content")
								.widget-item-wrapper.pos-r(v-for="(widget, index) in widgets" :key="index")
									i.pos-a(style="left:0;top:0;font-size: 12px;z-index: 9;") {{widget.type}}
									vue-lazy-component.d-widget-list-lazy-component
										div(slot="skeleton") 加载中...
										div.d-widget-list-img(draggable="true" v-if="widget.market" @dragstart="dragstart($event, type, index,tabKey,widget)")
											img(:src="widget.componentImage" )
										div.d-widget-list-img(draggable="true" v-if="!widget.market" @dragstart="dragstart($event, type, index,tabKey,widget)")
											img(:src="widget.snapshot")
		d-svg.fixed-toggle.pointer(icon-class="pin" :title="panelFixed ? '取消固定' : '固定小工具栏'" :class="{ active: panelFixed }" @click="handleFix")
</template>
<script>
	import parts from '../d-widget-part/index'
	import {Collapse, TabPane, Tabs, Panel} from 'view-design'
	import {component as VueLazyComponent} from '@xunlei/vue-lazy-component'
	import custom from '../../store/custom.store'

	export default {
		components: {
			parts,
			'i-collapse': Collapse,
			'i-tab-pane': TabPane,
			'i-tabs': Tabs,
			'i-panel': Panel,
			VueLazyComponent
		},
		data() {
			return {
				custom: custom.state,
				panelFixed: false,
				widgetListActiveMap: {},
				widgetListToggleTimer: {},
			}
		},
		methods: {
			handleFix() {
				this.panelFixed = !this.panelFixed
			},
			setActiveMap(tab, panel = '') {
				const key = tab + '-' + this.format(panel)
				if (!this.widgetListActiveMap[key]) this.$set(this.widgetListActiveMap, key, false)
			},
			handlePanelToggle(tab, panel = '') {
				const key = tab + '-' + this.format(panel)
				const map = this.widgetListActiveMap
				const prevKey = Object.keys(map).find(key => map[key])
				if (panel) this.widgetListActiveMap[key] = true
				if (prevKey) {
					if (key === prevKey || !panel && prevKey.indexOf(key) === 0) {
						this.widgetListToggleTimer[prevKey] && clearTimeout(this.widgetListToggleTimer[prevKey])
						return
					}
					this.widgetListToggleTimer[prevKey] = setTimeout(() => {
						this.widgetListActiveMap[prevKey] = false
					}, 400)
				}
			},
			format(type) {
				return type.split('-').join('_')
			},
			/**
			 * @description h5 原生拖拽事件
			 */
			dragstart(e, title, index, tabKey, {type, market, componentVersion}) {
				const widgetConfig = this.custom.widgets[tabKey].widgets[title].widgets[type]
				if (!widgetConfig || !type) return
				const {config} = widgetConfig
				e.dataTransfer.setData('widget-config', JSON.stringify({
					type,
					config,
					market,
					componentVersion,
					startX: e.offsetX,
					startY: e.offsetY,
				}))
			},
		},
	}
</script>
<style lang="scss" scoped>
	.d-widget-list-img {
		height: 100px;
	}

	.widget-item-wrapper {
		padding: 5px 0;
		margin-bottom: 5px;
		opacity: 0.9;
		transition: 0.2s;
		height: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		background: rgba(0, 0, 0, 0.5);

		> div {
			width: 100%;
			height: 100%;

			img {
				object-fit: contain;
				width: 100%;
				height: 100%;
			}
		}

		&:last-child {
			margin-bottom: 0;
		}

		&:hover {
			opacity: 1;
		}

		/deep/ {
			& > .widget-part {
				cursor: grab;
				outline: transparent dotted 1px;
				transition: outline-color 0.2s;

				&:hover {
					outline-color: #44ffcd;
				}

				& > div,
				& > label,
				& > form,
				& > ul {
					pointer-events: none;
				}
			}
		}
	}

	.widgets-panel {
		position: absolute;
		left: 0;
		top: 0;
		width: 428px;
		height: 100%;
		padding: 0;
		overflow: visible;
		background-color: white;
		transform: translateX(-100%);
		z-index: 2;
		transition: 0.3s 0.5s;

		&:after {
			content: '小工具';
			position: absolute;
			left: 100%;
			bottom: 2px;
			width: 24px;
			height: 82px;
			line-height: 1.2;
			text-align: center;
			padding: 10px 4px 30px;
			border-radius: 0 5px 5px 0;
			background-color: white;
			opacity: 0.9;
			z-index: -1;
			transition: 0.3s 0.5s;
		}

		/deep/ .ivu-tabs-card {
			padding: 10px;
			background-color: white;
			height: 100%;
		}

		&:hover,
		&.fixed {
			transition: 0.3s;
			transform: translateX(0);
			filter: drop-shadow(0 2px 5px #2d8bf083);

			&:not(.fixed):after {
				transition: 0.3s;
				opacity: 1;
				filter: drop-shadow(0 2px 5px #2d8bf083);
			}
		}

		&.fixed {
			filter: drop-shadow(0 2px 5px #2d8bf000);

			&:after {
				transition: 0.3s;
				opacity: 0;
				pointer-events: none;
			}
		}
	}

	.fixed-toggle {
		position: absolute;
		bottom: 5px;
		right: -24px;
		width: 24px;
		height: 24px;
		transform: rotate(0deg);
		opacity: 0.3;
		transition: 0.2s;
		cursor: pointer;

		&:hover {
			opacity: 0.5;
		}

		&.active {
			transform: rotate(-45deg);
			right: 0;
			opacity: 1;
		}
	}

	/deep/ {
		.ivu-tabs-bar {
			margin-bottom: 10px;
		}

		.ivu-tabs-content {
			height: calc(100% - 42px);

			.ivu-tabs-tabpane {
				height: 100%;
				overflow: hidden;
				overflow-y: auto;
			}
		}

		.ivu-collapse-header {
			padding-left: 7px !important;

			&:hover {
				background-color: rgba(0, 0, 0, 0.036);
			}
		}

		.ivu-collapse > .ivu-collapse-item.ivu-collapse-item-active > .ivu-collapse-header {
			padding-left: 7px !important;
			position: sticky;
			top: 0;
			z-index: 999;
			background-color: white;
		}

		.ivu-collapse-content {
			padding: 0;
		}
	}
</style>
