<template lang="pug">
drawer.d-drawer(v-bind="{ ...$props, ...$attrs }", v-on="$listeners", v-model="currentVal", :width="width")
	slot
</template>
<script lang="ts">
import { Drawer } from 'view-design'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
@Component({
	components: {
		Drawer,
	},
})
export default class DDrawer extends Vue {
	currentVal = false
	@Prop(Boolean) value!: boolean
	@Prop({ default: 335 }) width: number
	@Watch('value')
	onValueChange(val: boolean): void {
		this.currentVal = val
	}

	@Watch('currentVal')
	onCurrentVal(val: boolean): void {
		this.$emit('input', val)
	}
}
</script>
<style lang="scss" scoped>
.d-drawer {
	::v-deep {
		.ivu-drawer {
			top: 60px;
			height: calc(100vh - 60px);
		}

		.ivu-drawer-mask {
			background-color: rgba(0, 0, 0, 0);
		}

		.ivu-drawer-header {
			border: none;
		}

		.ivu-drawer-content {
			background: #22242b;

			.ivu-drawer-header-inner {
				color: #fff;
			}
		}

		.ivu-checkbox-inner {
			margin-right: 4px;
			background-color: rgb(24, 27, 36);
			border-color: #393b4a;
		}
	}
}
</style>
