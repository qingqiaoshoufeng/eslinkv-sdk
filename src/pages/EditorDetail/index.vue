<template lang="pug">
.detail-container
	.preview-wrapper.fit-mode(
		:class="{ mobile: isMobile }",
		:style="{ backgroundColor: platform.backgroundColor, backgroundImage: `url(${platform.backgroundImage})` }")
		.mobile-wrap(:style="{ height: mobileWrapHeight + 'px' }", v-if="isMobile")
			d-view(
				@mounted="updateSize",
				ref="previewContainer",
				:style="viewStyle")
		d-view(
			@mounted="updateSize",
			ref="previewContainer",
			v-else,
			:style="viewStyle")
		d-detail(:show="false")
		
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import dDetail from '../../components/d-detail/index.vue'
import dView from '../../components/d-view/index.vue'
import platform from '../../store/platform.store.js'
import { getQueryString } from '../../utils'

@Component({
	components: {
		dView,
		dDetail,
	},
})
export default class detail extends Vue {
	platform = platform.state
	isMobile = /android|iphone/i.test(navigator.userAgent)
	mobileWrapHeight = 0
	scaleY = 1
	scaleX = 0
	actualScaleRatio = 1

	get viewStyle() {
		let scale
		if (getQueryString('layoutMode') === 'full-size') {
			scale = `${this.scaleX},${this.scaleY}`
		} else {
			scale = this.actualScaleRatio
		}
		return `transform: scale(${scale}) translate3d(0, 0, 0); overflow: hidden;`
	}

	updateSize(val) {
		const w = val.width.replace(/(.*)px/, '$1')
		const h = val.height.replace(/(.*)px/, '$1')
		const { clientWidth, clientHeight } = document.body
		const layoutMode = getQueryString('layoutMode')
		switch (layoutMode) {
			case 'full-size':
				this.scaleX = clientWidth / w
				this.scaleY = clientHeight / h
				break
			case 'full-width':
				this.actualScaleRatio = clientWidth / w
				break
			case 'full-height':
				this.actualScaleRatio = clientHeight / h
				break
			default:
				this.actualScaleRatio = this.isMobile
					? clientWidth / w
					: Math.min(clientWidth / w, clientHeight / h)
		}
		this.mobileWrapHeight = h * this.actualScaleRatio
	}
}
</script>
<style lang="scss">
.detail-container {
	height: 100%;
}

.preview-wrapper {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 99999;
	display: flex;

	&::-webkit-scrollbar {
		width: 0;
		height: 0;
	}

	#screen {
		position: relative;
		flex-grow: 0;
		flex-shrink: 0;
	}

	&.fit-mode {
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	&.mobile {
		align-items: unset;
		overflow: auto;

		#screen {
			transform-origin: 0 0;
		}
	}

	.mobile-wrap {
		position: relative;
		width: 100%;
		overflow: hidden;
	}
}
</style>
