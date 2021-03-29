<template lang="pug">
.d-detail.fn-flex(v-if="show")
	.d-detail-left.fn-flex
		.d-detail-left-icon
			i-icon.pointer(type="ios-arrow-dropleft", @click="exit", :size="24")
		span.d-detail-title {{ platform.panelConfig.info ? platform.panelConfig.info.name : '' }}
	ul.d-detail-right.fn-flex
		li.fn-flex.flex-column.pointer(@click="preview", v-if="!isNew")
			i-icon(type="ios-desktop-outline", :size="24")
			span 预览
		li.fn-flex.flex-column.pointer(@click="handleExport")
			i-icon(type="ios-cloud-download-outline", :size="24")
			span 导出
		li.fn-flex.flex-column.pointer(@click="importModal = true")
			i-icon(type="ios-cloud-upload-outline", :size="24")
			span 导入
		li.fn-flex.flex-column.pointer(@click="handleSave('CUSTOM')")
			i-icon(type="ios-cloud-done-outline", :size="24")
			span 保存
		li.fn-flex.flex-column.pointer(
			@click="handleSave('TEMPLATE')",
			v-if="screenType === 'CUSTOM'"
		)
			i-icon(type="ios-cloud-circle-outline", :size="24")
			span 模板
		li.fn-flex.flex-column.pointer(@click="publishBoard")
			i-icon(type="ios-paper-plane-outline", :size="24")
			span 发布
	load-mask(:show="saving") 正在保存数据…
	Modal(v-model="importModal")
		Form
			FormItem
				label.ivu-btn.ivu-btn-primary.d-detail-import-button(for="originFile") 全覆盖导入
				input#originFile.fn-hide(
					type="file",
					accept="application/json",
					@change="handleFile"
				)
</template>
<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { Icon, Button, Modal, Form, FormItem } from "view-design";
import copy from "fast-copy";
import { mixins } from "vue-class-component";
import platform from "../../store/platform.store";
import scene from "../../store/scene.store";
import commonConfigValue from "../../../common-config-value";
import { isObjectString } from "../../utils/index";
import loadMask from "../load-mask/index.vue";
import importMx from "./import.mx";
import exportMx from "./export.mx";
import publishMx from "./publish.mx";
import detailMx from "./detail.mx";
import saveMx from "./save.mx";

@Component({
	components: {
		"i-icon": Icon,
		"i-button": Button,
		loadMask,
		Modal,
		Form,
		FormItem,
	},
})
export default class DFooter extends mixins(
	exportMx,
	detailMx,
	saveMx,
	importMx,
	publishMx
) {
	@Prop(Boolean) kanboardEdited: boolean;
	@Prop({ default: false }) disabled: boolean;
	@Prop({ default: true }) show: boolean; // detail,full,local 隐藏该模块

	platform = platform.state;
	scene = scene.state;
	saving = false;
	loading = false;
	isNew = true;
	screenType = "CUSTOM"; // 数据类型：0:看板, 1:小工具模板, 2:参考线模板

	preview() {
		window.open(`${location.origin}/detail/${this.$route.params.id}`);
	}

	exit() {
		if (this.kanboardEdited) {
			this.$Modal.confirm({
				title: "提示",
				content: "看板已编辑，关闭窗口将丢失未保存的数据，确认关闭吗？",
				onOk: () => {
					this.$router.replace({ name: "big-data-list" });
				},
			});
			return;
		}
		this.$router.go(-1);
	}

	getAttr(o, str) {
		const arr = str.split(".");
		let res = o;
		for (const v of arr) {
			if (res[v] === undefined) {
				res = {};
				break;
			}
			res = res[v];
		}
		return res;
	}

	checkAttr(o, str = "", defaultConfig) {
		for (const key in o) {
			const prop = str ? str + "." + key : key;
			if (Array.isArray(o[key]) && o[key].length > 0) {
				if (
					JSON.stringify(o[key]) ===
					JSON.stringify(this.getAttr(defaultConfig, prop))
				) {
					o[key] = "default";
				}
			} else if (
				Object.prototype.toString.call(o[key]) === "[object Object]"
			) {
				if (
					JSON.stringify(o[key]) ===
					JSON.stringify(this.getAttr(defaultConfig, prop))
				) {
					o[key] = "default";
				} else {
					this.checkAttr(o[key], prop, defaultConfig);
				}
			}
		}
	}

	platFormData() {
		const defaultConfig = commonConfigValue(); // 读取默认配置
		const panelConfig = this.platform.panelConfig;
		const {
			size,
			info: { name },
		} = panelConfig;
		delete size.preset;
		if (
			size.range &&
			!Object.values(size.range).find(
				(item) => item !== 0 && item !== "%"
			)
		) {
			delete size.range;
		}
		const widgetAdded = copy(this.platform.widgetAdded);
		const widgets = Object.values(widgetAdded).map(
			({ id, market = false, type, config, scene = 0 }) => {
				const api = config.api;
				if (api && api.data) {
					if (isObjectString(api.data)) {
						try {
							api.data = JSON.stringify(JSON.parse(api.data));
						} catch (e) {
							throw new Error(e);
						}
					}
				}
				this.checkAttr(config, "", defaultConfig);
				return {
					id,
					scene,
					type,
					market,
					value: { ...config },
				};
			}
		);

		const guides = this.platform.ruler.guideLines;
		return {
			screenName: name,
			screenConfig: {
				kanboard: panelConfig, // 看板画布配置
				widgets, // 小工具配置
				scene: this.scene.obj, // 场景
				guides, // 参考线
			},
		};
	}

	mounted() {
		this.isNew = !this.$route.params.id;
	}
}
</script>
<style lang="scss" scoped>
@import "../../scss/conf";

.d-detail {
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 60px;
	background-color: #313239;

	::v-deep button {
		margin-left: 10px;
	}

	.d-detail-left {
		align-items: center;
	}

	.d-detail-right {
		height: 100%;

		li {
			justify-content: center;
			height: 100%;
			padding: 0 15px;
			color: #fff;

			&:hover {
				background-color: rgba(255, 255, 255, 0.1);
			}
		}
	}

	.d-detail-import-button {
		line-height: 32px;
	}

	.d-detail-left-icon {
		height: 100%;
		padding: 0 15px;
		color: #fff;

		> i {
			line-height: 60px;
		}

		&:hover {
			background-color: rgba(255, 255, 255, 0.1);
		}
	}

	.d-detail-left {
		align-items: center;
		height: 100%;

		.d-detail-title {
			padding-left: 15px;
			font-size: 15px;
			color: #fff;
		}
	}
}
</style>
