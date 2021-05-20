<template lang="pug">
.container(:class="{ active: platform.searchModal }")
	.d-detail-search.animated.searchFadeInDown(v-click-outside="close")
		i-input.d-detail-input(
			@on-focus="event.inputFocus = true",
			@on-blur="event.inputFocus = false",
			suffix="ios-search",
			placeholder="请输入组件名",
			v-model="keyword")
		ul.result
			li(v-for="(k, i) in searchResult", :key="i", @click="check(k)") {{ k.config.widget.name }}
</template>
<script lang="ts">
import platform from '../../store/platform.store'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Icon, Input } from 'view-design'
import ClickOutside from 'vue-click-outside'
import scene from '../../store/scene.store'
import event from '../../store/event.store'

@Component({
	components: {
		'i-icon': Icon,
		'i-input': Input,
	},
	directives: { ClickOutside },
})
export default class DSearch extends Vue {
	searchResult = []
	platform = platform.state
	scene = scene.state
	event = event.state
	keyword = ''

	@Watch('keyword')
	keywordChange(val) {
		if (!val) {
			this.searchResult = []
			return
		}
		let arr = []
		for (const key in this.platform.widgetAdded) {
			if (
				this.platform.widgetAdded[key].config.widget.name.includes(val)
			) {
				arr.push(this.platform.widgetAdded[key])
			}
		}
		this.searchResult = arr
	}

	close() {
		if (this.platform.searchModal) {
			this.platform.searchModal = false
		}
	}

	check(widget) {
		this.scene.index = widget.scene
		this.platform.chooseWidgetId = widget.id
		this.platform.searchModal = false
	}
}
</script>
<style lang="scss" scoped>
.container {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 9999;
	display: none;

	&.active {
		display: block;
	}
}

.d-detail-search {
	position: absolute;
	top: 100px;
	left: 50%;
	width: 70%;
	margin-left: calc(-35% + 18px);
	border-radius: 4px;

	/deep/ {
		.d-detail-input {
			input {
				color: #fff;
				background: rgba(10, 10, 14, 0.7);
			}
		}
	}
}

.result {
	max-height: 200px;
	margin-top: 10px;
	overflow-y: auto;
	background: rgba(10, 10, 14, 0.7);

	li {
		height: 30px;
		padding: 0 10px;
		margin: 4px 0;
		line-height: 30px;
		color: #fff;

		&:hover {
			background: #2d8cf0;
		}
	}

	&::-webkit-scrollbar {
		width: 4px;
		height: 1px;
		transition: all 0.3s;
	}

	&::-webkit-scrollbar-thumb {
		background: rgba(83, 83, 83, 1);
		border-radius: 10px;
		transition: all 0.3s;
	}

	&::-webkit-scrollbar-track {
		background: rgba(237, 237, 237, 1);
		border-radius: 10px;
		transition: all 0.3s;
	}
}

.searchFadeInDown {
	animation-name: searchFadeInDown;
}

@keyframes searchFadeInDown {
	0% {
		opacity: 0;
		-webkit-transform: translateY(-20px);
		transform: translateY(-20px);
	}

	100% {
		opacity: 1;
		-webkit-transform: translateY(0);
		transform: translateY(0);
	}
}
</style>
