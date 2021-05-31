<template lang="pug">
#screen.canvas-wrapper(ref="canvas-wrapper", :style="canvasStyle()")
	template(v-for="item in screen.screenWidgets")
		parts(
			v-if="showParts(item)",
			:key="item.id",
			:type="item.type",
			:config="item.config",
			:ref="item.id",
			:market="item.market",
			:style="item.config.widget.hide ? 'display: none' : ''",
			readonly)
</template>
<script lang="ts">
import parts from '../d-widget-part/index.vue'
import loadMask from '../load-mask/index.vue'
import instance from '../../store/instance.store'
import { Component, Vue, Provide } from 'vue-property-decorator'

@Component({
	components: {
		parts,
		loadMask,
	},
})
export default class DView extends Vue {
	@Provide('kanboardEditor') kanboardEditor = this

	screen = {}
	canvasStyle() {
		const val = {
			width: `${this.screen.width}px`,
			height: `${this.screen.height}px`,
			'background-color': this.screen.backgroundColor,
			'background-image': `url(${this.screen.backgroundImage})`,
		}
		if (val) {
			this.$emit('mounted', val)
		}
		return val
	}

	showParts(item) {
		if (item.scene === 0) {
			return true
		} else if (item.scene === this.screen.sceneIndex) {
			return true
		}
		return false
	}

	mounted() {
		instance.actions.setInstance('kanboard', this)
		this.screen = this.$screen
		this.screen.setStatus('inPreview')
	}
}
</script>
<style lang="scss" scoped>
.canvas-wrapper {
	&::before {
		display: flex;
		content: '';
	}
}

::v-deep {
	.load-mask {
		position: fixed !important;
	}
}
</style>
