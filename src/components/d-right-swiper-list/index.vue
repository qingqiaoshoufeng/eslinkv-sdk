<template lang="pug">
.func-group.fn-flex.flex-column
	d-right-swiper(:title="title", :icon="icon", @icon-click="handleClick")
		.func-group-tab.fn-flex.flex-row(v-if="list.length > 0")
			span.pointer(
				@click="handleClickTab(i)",
				v-for="(v, i) in list",
				:class="{ active: index === i }") {{ prefix }}{{ i + 1 }}
		.func-group-empty.fn-flex.flex-row(v-else)
			img(src="../../assets/empty.png")
			span 暂无数据
		template(v-for="(v, i) in list")
			slot(:index="i", :activeIndex="index", v-if="i === index")
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import dRightSwiper from '../d-right-swiper/index.vue'
@Component({ components: { dRightSwiper } })
export default class FuncGroup extends Vue {
	@Prop() title: string
	@Prop({ default: '配置' }) prefix: string
	@Prop({ default: false }) show: boolean
	@Prop({ default: [] }) list
	index = 0
	icon = [
		{ icon: 'md-add-circle', msg: '加一个' },
		{ icon: 'md-trash', msg: '减一个' },
	]

	handleClickTab(index) {
		this.index = index
	}

	handleClick(value) {
		if (value === 'md-add-circle') {
			this.$emit('add-click')
		}
		if (value === 'md-trash') {
			this.$emit('remove-click', this.index)
			this.index = 0
		}
	}
}
</script>
<style lang="scss" scoped>
.func-group-empty {
	justify-content: center;
	align-items: center;
	img {
		max-width: 50%;
	}
	span {
		padding: 5px 10px 0 10px;
		font-size: 12px;
		color: #bfbfbf;
	}
}
.func-group-tab {
	border-bottom: 1px solid var(--borderGray);
	margin-bottom: 10px;
	padding: 5px 10px 0 10px;
	flex-wrap: wrap;
	span {
		margin-right: 10px;
		padding-bottom: 5px;
		&:last-child {
			margin-bottom: 0;
		}
		&.active {
			border-bottom: 1px solid var(--themeColor);
			color: var(--themeColor);
		}
	}
}
.func-group {
	::v-deep + .d-manage-modal-control {
		margin-top: 10px;
	}
}
</style>
