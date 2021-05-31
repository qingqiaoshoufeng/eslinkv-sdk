<template lang="pug">
.d-right-modal-box.z-index-999.fn-flex.flex-column(
	:style="{ width: `${ruler.xRoomR1}px`, height: '100%', flex: 1 }")
	.d-right-modal-name.fn-flex.flex-row(
		:style="{ marginBottom: '10px' }",
		v-click-outside="close")
		i-input.screen-name(
			v-if="editName",
			v-model="screen.name",
			@on-click="editName = false",
			:autofocus="true")
		span.screen-name-text(v-if="!editName") {{ screen.name }}
		i-icon.pointer.screen-name-icon(
			type="ios-create-outline",
			@click.stop="editName = true",
			v-if="!editName")
	.d-right-modal-border
	config
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import config from './config.vue'
import { Icon, Input } from 'view-design'
import ClickOutside from 'vue-click-outside'

@Component({
	components: {
		config,
		'i-icon': Icon,
		'i-input': Input,
	},
	directives: { ClickOutside },
})
export default class DRightManage extends Vue {
	editName = false
	ruler = {}
	screen = {}
	close() {
		this.editName = false
	}
	mounted() {
		this.screen = this.$screen
		this.ruler = this.$ruler
	}
}
</script>
<style lang="scss" scoped>
.screen-name-icon {
	line-height: 32px;
}

.d-right-modal-name {
	line-height: 32px;
}

.screen-name {
	&::v-deep {
		.ivu-input {
			padding: 0;
			font-size: 20px;
			line-height: 20px;
			color: #fff;
			background-color: transparent;
			border: none;
			border-bottom: 1px solid var(--borderGray);
			border-radius: 0;
			outline: none;
			box-shadow: none;
		}
	}
}
</style>
