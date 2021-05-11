<template lang="pug">
.d-detail-search.pos-a.z-index-999(
	:class="{ active: platform.searchModal }",
	@click="platform.searchModal = true")
	i-input.d-detail-input(suffix="ios-search", placeholder="请输入组件名")
</template>
<script lang="ts">
import platform from '../../store/platform.store'
import { Component, Vue } from 'vue-property-decorator'
import { Icon, Input } from 'view-design'

@Component({
	components: {
		'i-icon': Icon,
		'i-input': Input,
	},
})
export default class DSearch extends Vue {
	platform = platform.state
}
</script>
<style lang="scss" scoped>
.d-detail-search {
	opacity: 0;
	top: -200px;
	width: 70%;
	left: 50%;
	margin-left: calc(-35% + 18px);
	transition: all 0.3s;
	border-radius: 4px;
	::v-deep {
		.d-detail-input {
			input {
				background-color: transparent;
			}
		}
	}
	&.active {
		opacity: 1;
		top: 100px;
	}
}
</style>
