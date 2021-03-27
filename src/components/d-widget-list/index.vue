<template lang="pug">
  .widgets-panel.pos-a(:class="{ fixed: platform.panelFixed }")
    i-tabs(:animated="false")
      i-tab-pane(v-for="(tab,tabKey) in custom.widgets" :key="tab.name" :label="tab.label" :name="tab.name")
        i-collapse(accordion simple)
          i-panel(:key="type" :name="type||componentEnTitle" v-for="{ label, type, widgets,componentEnTitle,componentTitle } in tab.widgets")
            span {{ label||componentTitle }}
            template(slot="content")
              item-card(v-for="(widget, index) in widgets"
                :key="index"
                :index="index"
                :widget="widget"
                :tabKey="tabKey"
                :type="type||componentEnTitle")
</template>
<script>
	import parts from '../d-widget-part/index'
	import { Collapse, TabPane, Tabs, Panel } from 'view-design'
	import custom from '../../store/custom.store'
	import platform from '../../store/platform.store'
	import itemCard from './item-card'

	export default {
		components: {
			parts,
			'i-collapse': Collapse,
			'i-tab-pane': TabPane,
			'i-tabs': Tabs,
			'i-panel': Panel,
			itemCard
		},
		data () {
			return {
				custom: custom.state,
				platform: platform.state,
				widgetListToggleTimer: {}
			}
		},
		methods: {
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

	.widgets-panel {
		top: 0;
		left: 0;

		/* todo 修改尺寸 */
		width: 260px;
		height: 100%;
		padding: 0;
		overflow: visible;
		background-color: #22242b;
	}
</style>
