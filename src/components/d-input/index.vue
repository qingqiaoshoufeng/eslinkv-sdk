<template lang="pug">
i-input.d-input(
	v-bind="{...$props,...$attrs}",
	v-on="$listeners",
	@on-focus="event.inputFocus = true",
	@on-blur="event.inputFocus = false")
	span.d-input-append(slot="append", v-if="append") {{ append }}
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Input } from 'view-design'
import event from '../../store/event.store.js'
@Component({
	components: {
		'i-input': Input,
	},
})
export default class DInput extends Vue {
	event = event.state
	@Prop() append
}
</script>
<style lang="scss" scoped>
.d-input {
	border: 1px solid #393b4a;

	/deep/ {
		.ivu-input {
			color: #fafafa;
			background-color: #181b24;
			border: none;
			border-radius: 2px;
		}

		.ivu-input-group-append {
			background-color: #181b24;
			border: none;
		}
	}
}
</style>
