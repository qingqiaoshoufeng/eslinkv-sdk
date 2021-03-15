<template lang="pug">
	.home-container
		.layout-wrapper
			.main-container
				.d-editor-box.pos-r.fn-flex
					d-widget-list(ref="widgets" :class="{ 'd-editor-fullscreen': platform.fullscreen }")
					d-editor(ref="kanboardEditor")
			d-footer
</template>
<script lang="ts">
	import { Vue, Component, Provide } from 'vue-property-decorator'
	import platform from '../../store/platform.store'
	import dWidgetList from '../../components/d-widget-list/index.vue'
	import dEditor from '../../components/d-editor/index.vue'
	import dFooter from '../../components/d-footer/index.vue'

	@Component({
		components: { dWidgetList, dEditor, dFooter }
	})
	export default class editor extends Vue {
		platform = platform.state
		@Provide('kanboardEditor') kanboardEditor = this.$refs.kanboardEditor
	}
</script>
<style lang="scss" scoped>
	.d-editor-box {
		width: 100%;
		height: 100%;

		.d-editor-fullscreen {
			position: fixed;
		}

		/deep/ {
			.widgets-panel.fixed + .center {
				width: calc(100% - 428px) !important;
				margin-left: 428px !important;
			}
		}
	}

	.layout-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		padding: 0 !important;
	}

	.main-container {
		width: 100%;
		height: calc(100% - 50px);
	}

	.line {
		width: 100%;
		margin: 13px 0;
		border-bottom: 1px dashed #414141;
		opacity: 0.4;
	}

	#kanban:-webkit-full-screen {
		width: 100%;
		height: 100%;
	}
</style>
<style lang="scss">
	.home-container {
		height: 100%;
		overflow: hidden;
	}

	.d-editor-box {
		.left {
			.components {
				.ivu-collapse-header {
					background-color: #fff;
				}

				.ivu-collapse-content {
					overflow: auto;
					background-color: #f8f8f8;
				}
			}
		}

		.right {
			.ivu-tabs-tab {
				padding: 6px 10px !important;
			}

			.ivu-collapse {
				margin-bottom: 16px;
				border: 0;
			}

			.ivu-collapse-header {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.ivu-icon {
					margin: 0;
				}
			}

			.ivu-collapse-content {
				padding: 0;
				background-color: #f8f8f8;
			}

			.ivu-form-item-content {
				margin-left: 75px;
			}
		}
	}

	.form-wrapper {
		padding: 10px;

		.form-item {
			display: flex;
			align-items: center;
			margin-top: 10px;
		}

		.form-label {
			min-width: 5em;
			padding-right: 1em;
			white-space: nowrap;
		}
	}
</style>
