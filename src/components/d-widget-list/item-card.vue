<template lang="pug">
  vue-lazy-component.widget-item-wrapper.pos-r
    div(slot="skeleton") 加载中...
    .fn-flex.flex-row.d-widget-list-card
      .d-widget-list-img.fn-flex(draggable="true" @dragstart="dragstart($event, type, index,tabKey,widget)")
        img(:src="widget.componentAvatar" )
      .fn-flex.flex-column
        i.d-widget-list-type.ellipsis {{label}}
        i.d-widget-list-type.ellipsis {{type}}
</template>
<script lang="ts">
	import { Component, Vue, Prop } from 'vue-property-decorator'
	import { component as VueLazyComponent } from '@xunlei/vue-lazy-component'

  @Component({
    components: {
      VueLazyComponent
    }
  })
	export default class ItemCard extends Vue {
	  @Prop() widget:any
	  @Prop() type
	  @Prop() index
	  @Prop() tabKey
	  @Prop() label

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
  </script>
<style lang="scss" scoped>
.d-widget-list-type {
	width: 74px;
	margin-left: 10px;
}

.d-widget-list-card {
	align-items: center;
}

.d-widget-list-img {
	align-items: center;

	img {
		max-width: 144px;
		max-height: 144px;
	}
}

.widget-item-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 5px;
	overflow: hidden;
	background: rgba(0, 0, 0, 1);
	opacity: 0.9;
	transition: 0.3s;

	&:last-child {
		margin-bottom: 0;
	}

	&:hover {
		opacity: 1;
	}

	/deep/ {
		& > .d-widget-list-img {
			cursor: grab;
			outline: transparent dotted 1px;
			transition: outline-color 0.2s;
		}
	}
}
</style>
