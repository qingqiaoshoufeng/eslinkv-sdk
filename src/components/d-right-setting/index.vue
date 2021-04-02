<template lang="pug">
  div(v-if="platform.chooseWidgetState")
  .d-right-modal-box.z-index-999(:style="{width:`${platform.ruler.xRoomR1}px`}" v-else)
    .d-right-modal-title.pointer.text-center.fn-flex.flex-row
      span.pos-r(v-for="(item,index) in title" @click="handleClick(index)" :key="item" :class="{active:index===choose}") {{item}}
    .d-right-modal.d-scrollbar
      template(v-if="platform.chooseWidgetState")
        itemList(v-for="(item,index) in list" :list="item.key" v-if="choose===index" :needChoose="item.needChoose")
      template(v-else)
        itemList(v-for="(item,index) in chooseList" :list="item.key" v-if="choose===index" :needChoose="item.needChoose")
</template>
<script lang="ts">
	import { Component, Vue, Watch } from 'vue-property-decorator'
	import itemList from './item-list.vue'
	import platform from '../../store/platform.store'

	@Component({
		components: {
			itemList
		}
	})
	export default class DRightSetting extends Vue {
    choose = 0
		platform = platform.state
		chooseList: any = [
			{
				 key: [{ type: 'base' }], needChoose: true
			},
			{
				 key: [{ type: 'data' }], needChoose: true
			},
			{
				key: [{ type: 'animation' }], needChoose: true
			},
			{
				 key: [], needChoose: true
			}
		]

    list: any = [
      {
        key: [{ type: 'config' }], needChoose: false
      }
    ]

    get title () {
      if (this.platform.chooseWidgetState) {
        return ['大屏']
      } else {
        if (this.chooseList[3].key.length > 0) {
          return ['基础', '数据', '动画', '自定义']
        } else {
          return ['基础', '数据', '动画']
        }
      }
    }

    @Watch('platform.chooseWidgetState')
    onChooseWidgetId () {
      this.tabIndex = 0
    }

		@Watch('platform.chooseWidgetCustomConfig', { deep: true })
		changeChooseWidgetCustomConfig (val) {
			this.chooseList[3].key = val
		}

    handleClick (index) {
			this.choose = index
		}
	}
</script>
