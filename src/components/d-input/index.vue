<template lang="pug">
i-input.d-input(v-bind="{...$props,...$attrs}", v-on="$listeners")
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Input } from 'view-design'

@Component({
	components: {
		'i-input': Input,
	},
})
export default class DInput extends Vue {}
</script>
<style lang="scss" scoped>
.d-input {
	::v-deep {
		.ivu-input {
			color: #fafafa;
			background-color: #181b24;
			border: 1px solid #393b4a;
			border-radius: 2px;
		}
	}
}
</style>
