<template lang="pug">
  .widgets-panel(:class="{ fixed: platform.panelFixed }")
    i-tabs(:animated="false" type="card" @on-click="(name) => handlePanelToggle(name)")
      template(v-for="(tab,tabKey) in custom.widgets")
        i-tab-pane(:key="tab.name" :label="tab.label" :name="tab.name")
          i-collapse(accordion simple @on-change="(keys) => handlePanelToggle(tab.name, keys[0])")
            i-panel(:key="type" :name="type||componentEnTitle" :activeSet="setActiveMap(tab.name, type)" v-for="{ label, type, widgets,componentEnTitle,componentTitle } in tab.widgets")
              span {{ label||componentTitle }}
              template(v-if="widgetListActiveMap[`${tab.name}-${format(type||componentEnTitle)}`]" slot="content")
                .widget-item-wrapper.pos-r(v-for="(widget, index) in widgets" :key="index")
                  i.pos-a(style="left:0;top:0;font-size: 12px;z-index: 9;") {{widget.type||componentEnTitle}}
                  vue-lazy-component.d-widget-list-lazy-component
                    div(slot="skeleton") 加载中...
                    div.d-widget-list-img(draggable="true" v-if="widget.market" @dragstart="dragstart($event, type||componentEnTitle, index,tabKey,widget)")
                      img(:src="widget.componentAvatar" )
                    div.d-widget-list-img(draggable="true" v-if="!widget.market" @dragstart="dragstart($event, type, index,tabKey,widget)")
                      img(:src="widget.componentAvatar")
    d-svg.fixed-toggle.pointer(icon-class="pin" :title="platform.panelFixed ? '取消固定' : '固定小工具栏'" :class="{ active: platform.panelFixed }" @click="handleFix")
</template>
<script>
	import parts from '../d-widget-part/index'
	import { Collapse, TabPane, Tabs, Panel } from 'view-design'
	import { component as VueLazyComponent } from '@xunlei/vue-lazy-component'
	import custom from '../../store/custom.store'
	import platform from '../../store/platform.store'

	export default {
		components: {
			parts,
			'i-collapse': Collapse,
			'i-tab-pane': TabPane,
			'i-tabs': Tabs,
			'i-panel': Panel,
			VueLazyComponent
		},
		data () {
			return {
				custom: custom.state,
				platform: platform.state,
				widgetListActiveMap: {},
				widgetListToggleTimer: {}
			}
		},
		methods: {
			handleFix () {
				this.platform.panelFixed = !this.platform.panelFixed
			},
			setActiveMap (tab, panel = '') {
				const key = tab + '-' + this.format(panel)
				if (!this.widgetListActiveMap[key]) this.$set(this.widgetListActiveMap, key, false)
			},
			handlePanelToggle (tab, panel = '') {
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
			format (type) {
				return type.split('-').join('_')
			},
			/**
			 * @description h5 原生拖拽事件
			 */
			dragstart (e, title, index, tabKey, obj) {
				const { market, componentVersion, componentConfig, componentId } = obj
				if (!index) return
				let widgetConfig
				if (market) {
					widgetConfig = { config: { layout: componentConfig.layout } }
				} else {
					widgetConfig = this.custom.widgets[tabKey].widgets[title].widgets[index]
				}
				const { config } = widgetConfig
				e.dataTransfer.setData('widget-config', JSON.stringify({
					type: index,
					config,
					market,
					componentVersion,
					componentId,
					startX: e.offsetX,
					startY: e.offsetY
				}))
			}
		}
	}
</script>
<style lang="scss" scoped>
	.d-widget-list-img {
		height: 100px;
	}

	.widget-item-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100px;
		padding: 5px 0;
		margin-bottom: 5px;
		overflow: hidden;
		background: rgba(0, 0, 0, 0.5);
		opacity: 0.9;
		transition: 0.2s;

		> div {
			width: 100%;
			height: 100%;

			img {
				width: 100%;
				height: 100%;
				object-fit: contain;
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
		top: 0;
		left: 0;
		z-index: 2;
		width: 428px;
		height: 100%;
		padding: 0;
		overflow: visible;
		background-color: white;
		transition: 0.3s 0.5s;
		transform: translateX(-100%);

		&::after {
			position: absolute;
			bottom: 2px;
			left: 100%;
			z-index: -1;
			width: 24px;
			height: 82px;
			padding: 10px 4px 30px;
			line-height: 1.2;
			text-align: center;
			content: '小工具';
			background-color: white;
			border-radius: 0 5px 5px 0;
			opacity: 0.9;
			transition: 0.3s 0.5s;
		}

		/deep/ .ivu-tabs-card {
			height: 100%;
			padding: 10px;
			background-color: white;
		}

		&:hover,
		&.fixed {
			filter: drop-shadow(0 2px 5px #2d8bf083);
			transition: 0.3s;
			transform: translateX(0);

			&:not(.fixed)::after {
				filter: drop-shadow(0 2px 5px #2d8bf083);
				opacity: 1;
				transition: 0.3s;
			}
		}

		&.fixed {
			filter: drop-shadow(0 2px 5px #2d8bf000);

			&::after {
				pointer-events: none;
				opacity: 0;
				transition: 0.3s;
			}
		}
	}

	.fixed-toggle {
		position: absolute;
		right: -24px;
		bottom: 5px;
		width: 24px;
		height: 24px;
		cursor: pointer;
		opacity: 0.3;
		transition: 0.2s;
		transform: rotate(0deg);

		&:hover {
			opacity: 0.5;
		}

		&.active {
			right: 0;
			opacity: 1;
			transform: rotate(-45deg);
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
			position: sticky;
			top: 0;
			z-index: 999;
			padding-left: 7px !important;
			background-color: white;
		}

		.ivu-collapse-content {
			padding: 0;
		}
	}
</style>
