<template lang="pug">
.d-suspension.fn-flex.flex-column.pos-a.z-index-999(:style="{ right: `${editor.xRoomR1 + 20}px` }")
	.d-suspension-item.pointer.pos-r.fn-flex
		i-tooltip(content="更新组件", placement="left")
			i-icon.pointer(type="md-sync", @click="update", :size="22")
		updateDrawer(v-model="showDrawer", :data="updateInfo")
</template>
<script lang="ts">
import updateDrawer from './updateDrawer.vue'
import { Component, Vue } from 'vue-property-decorator'
import { Icon, Tooltip } from 'view-design'
import { versionUpdateList } from '@/vue2/api/marketComponent.api'
import Editor from '@/core/Editor'

@Component({
	components: {
		'i-icon': Icon,
		'i-tooltip': Tooltip,
		updateDrawer,
	},
})
export default class DSuspension extends Vue {
	editor = Editor.Instance()
	showDrawer = false
	updateInfo = []
	async update() {
		const req = []
		Object.values(this.editor.sceneWidgets[this.editor.current.currentSceneIndex]).forEach((v: any) => {
			if (v.market) {
				req.push({
					componentEnTitle: v.type,
					componentVersion: v.config.widget.componentVersion,
					componentId: v.id,
					componentTitle: v.config.widget.name,
				})
			}
		})
		this.updateInfo = await versionUpdateList({ components: req })
		if (this.updateInfo.length === 0) {
			this.$Message.warning('暂无可更新组件')
			return
		}
		this.showDrawer = true
	}
}
</script>
<style lang="scss" scoped>
.d-suspension {
	top: 88px;
	right: 338px;
	width: 46px;
	background: #22242b;
	box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.5);
}

.d-suspension-item {
	align-items: center;
	justify-content: center;
	width: 46px;
	height: 46px;
	color: #bfbfbf;
	cursor: pointer;
	border-bottom: 1px solid #393b4a;

	&:last-child {
		border: none;
	}
}
</style>
