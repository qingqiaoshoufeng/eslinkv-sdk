<template lang="pug">
	.d-manage-modal-control
		label {{config.label}}
		.webms
			video(
				v-for="(k, i) in config.options"
				:key="i"
				:src="k"
				@click="pick(k)"
				autoplay="autoplay"
				muted="muted"
				loop
				:class="{active: k === obj[inputKey]}"
			)
</template>
<script lang="ts">
	import func from './func.mx'
	import {Component} from 'vue-property-decorator'

	@Component
	export default class FuncWebm extends func {
		pick(webm) {
			this.obj[this.inputKey] = webm
		}
	}
</script>
<style lang="scss" scoped>
	.webms {
		video {
			width: 50px;
			margin-right: 10px;
			border: 1px solid transparent;

			&.active {
				border: 1px solid #464f5c;
			}
		}
	}
</style>
