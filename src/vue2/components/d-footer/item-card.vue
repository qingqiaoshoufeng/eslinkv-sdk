<template lang="pug">
li.fn-flex.flex-row
	label.d-footer-name {{ item.name }}
	.d-footer-key-code.fn-flex.flex-row(v-for="child in item.key")
		.d-footer-hot-key-text(v-if="child.type === 'text'") {{ child.value }}
		.d-footer-hot-key-item(v-if="child.type === '+'") +
		img.d-footer-hot-key-img(v-if="child.type === 'img'", :src="child.value")
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class ItemCard extends Vue {
	@Prop() item
}
</script>
<style lang="scss" scoped>
li {
	align-items: center;
	height: 44px;
	white-space: nowrap;
	border-bottom: 1px solid #22242b;

	&:last-child {
		border-bottom: none;
	}
}

.d-footer-key-code {
	&:last-child {
		.d-footer-hot-key-text {
			margin-right: 0;
		}
	}
}

.d-footer-name {
	padding: 3px 10px;
	margin-right: auto;
	text-align: right;
	letter-spacing: 0;
}

.d-footer-hot-key-img {
	margin-left: 6px;
}

.d-footer-hot-key-text {
	min-width: 22px;
	padding: 0 4px;
	margin-right: 10px;
	margin-left: 10px;
	font-style: normal;
	text-align: center;
	border: 1px solid #ddd;
	border-radius: 2px;
}

.d-footer-hot-key-img {
	width: 18px;
	text-align: center;
}
</style>
