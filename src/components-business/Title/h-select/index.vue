<template>
	<div class="widget-part pos-r" :style="styles">
		<div class="h-select fn-flex flex-row pos-r">
			<h2 class="fn-flex flex-row" @click="showOptions = !showOptions">
				<span>{{ selectLabel }}</span>
				<img src="./h-select-1.svg" />
			</h2>
			<ul class="pos-a" v-if="showOptions">
				<li
					class="pointer"
					v-for="item in data ? data : []"
					@click="handleChange(item)"
				>
					{{ item.label }}
				</li>
			</ul>
		</div>
	</div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import widgetMixin from '../../../../mixins'
import { value } from './index.component'
@Component
export default class extends mixins(widgetMixin) {
	showOptions = false
	selectLabel = '年'
	selectValue = 'year'
	handleChange(item) {
		this.selectValue = item.value
		this.selectLabel = item.label
		this.showOptions = false
		this.emitComponentUpdate(item)
	}
	created() {
		this.configValue = this.parseConfigValue(value)
	}
	mounted() {
		this.emitComponentUpdate({
			value: this.selectLabel,
			label: this.selectValue,
		})
	}
}
</script>
<style lang="scss">
.h-select {
	height: 100%;
	background: #001f6d;
	border: 1px solid #0057a9;
	border-radius: 4px;

	ul {
		top: 24px;
		right: 0;
		width: 100%;
		border: 1px solid #0057a9;
		border-radius: 4px;
	}

	h2 {
		align-items: center;
		width: 100%;
		font-weight: normal;
		color: #fff;

		span {
			margin-right: auto;
			margin-left: 8px;
			font-size: 16px;
			line-height: 16px;
		}

		img {
			margin-right: 8px;
		}
	}

	li {
		padding-right: 8px;
		font-size: 16px;
		line-height: 20px;
		color: #fff;
		background: #001f6d;
		border-bottom: 1px solid #0057a9;
		transition: all 0.3s;

		&:hover {
			opacity: 0.8;
		}

		&:last-child {
			border-bottom: none;
		}
	}
}
</style>
