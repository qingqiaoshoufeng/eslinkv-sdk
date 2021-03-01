<template lang="pug">
	.change-log-container.d-scrollbar
		i-time-line
			i-time-line-item(v-for="item in list")
				.change-log-title.fn-flex.flex-row
					h2 {{item.version}}
					p {{item.description}}
				i-tag.change-time(color="volcano") {{item.time}}
				ul
					li.change-log(v-for="child in item.list")
						.change-log-item
							template(v-if="child.type")
								i-icon.change-log-icon(:type="type(icon)" v-for="icon in child.type")
							span {{child.content}}
</template>
<script lang="ts">
	import 'markdown-it-vue/dist/markdown-it-vue.css'
	import {Component, Vue} from 'vue-property-decorator'
	import {Timeline, TimelineItem, Tag, Icon} from 'view-design'

	@Component({
		components: {
			'i-time-line': Timeline,
			'i-time-line-item': TimelineItem,
			'i-tag': Tag,
			'i-icon': Icon,
		}
	})
	export default class ChangeLog extends Vue {
		list: any[] = []

		get type() {
			return (type) => {
				let text = ''
				switch (type) {
					case 'fix':
						text = 'ios-bug'
						break;
					case 'perf':
						text = 'md-thumbs-up'
						break
					case 'refactor':
						text = 'ios-bulb'
						break
				}
				return text
			}
		}

		init() {
			const log = require.context('../../../changelog', true, /\.(js)$/)
			let list = []
			log.keys().forEach(name => {
				const time = name.split('/')[1].replace('.js', '')
				const item = log(name).default
				list.unshift({
					time, ...item
				})
			})
			this.list = list
		}

		mounted() {
			this.init()
		}
	}
</script>
<style lang="scss">
	.change-log-container {
		padding: 20px;
		height: calc(100vh);
		overflow-y: auto;
		background-color: #fff;

		.change-log-title {
			align-items: center;
			margin-top: -10px;

			p {
				margin-left: 10px;
				color: #999;
			}
		}

		ul {
			margin-top: 10px;
		}

		.change-log-icon {
			margin-right: 10px;
		}

		.change-time {
			border: none;
		}

		.change-log-item {
			align-items: center;
			line-height: 14px;
		}

		.change-log {
			list-style: circle;
			margin-left: 20px;
			margin-bottom: 10px;
			line-height: 14px;
		}
	}
</style>
