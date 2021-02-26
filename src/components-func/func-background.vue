<template lang="pug">
	.d-manage-modal-control
		label {{config.label}}
		.imgs
			img(
				v-for="(k, i) in config.options"
				:key="i"
				:src="k"
				@click="pick(k)"
				:class="{active: k === obj[inputKey]}"
			)
</template>
<script lang="ts">
	import func from './func.mx'
	import {Component} from 'vue-property-decorator'

	@Component
	export default class FuncBackground extends func {
		pick(img) {
			this.obj[this.inputKey] = img
		}
	}
</script>
<style lang="scss" scoped>
	.imgs {
		img {
			width: 50px;
			margin-right: 10px;
			border: 1px solid #464f5c;

			&.active {
				border: 1px solid #ec3f3f;
			}
		}
	}
</style>
