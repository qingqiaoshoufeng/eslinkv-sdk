<template>
	<div class="es-item-content">
		<!-- 0：数字文本框 -->
		<template v-if="data.type === 0">
			<InputNumber
				v-model="model[data.enName]"
				@on-change="onChange"
				:size="data.size || 'default'"
				:max="
                    (typeof data.max !== 'undefined' && Number(data.max)) ||
                    data.max == 0
                        ? Number(data.max)
                        : Infinity
                "
				:min="
                    (typeof data.min !== 'undefined' && Number(data.min)) ||
                    data.min == 0
                        ? Number(data.min)
                        : -Infinity
                "
				:step="data.step || 1"
				:placeholder="data.placeholder || ''"
				:formatter="data.formatter"
				:parser="data.parser"
				:readonly="setDefaultBool(data.readonly, false)"
				:editable="setDefaultBool(data.editable, true)"
				:precision="data.precision"
				:active-change="setDefaultBool(data.activeChange, true)"
				class="w100"
			>
			</InputNumber>
		</template>
		<!-- 1：字符串文本框 -->
		<template v-else-if="data.type === 1">
			<i-input
				v-model="data.desensitizeEnName"
				@on-change="onChange"
				@on-click="clickIcon"
				@on-clear="onClear"
				@on-blur="onBlur"
				@on-focus="onFocus"
				:maxlength="data.maxlength"
				:type="data.inputType || 'text'"
				:placeholder="data.placeholder || ''"
				:clearable="setDefaultBool(data.clearable, true)"
				:icon="data.icon || ''"
				:prefix="data.prefix || ''"
				:suffix="data.suffix || ''"
				:search="setDefaultBool(data.search, false)"
				:enter-button="data.enterButton"
				:autofocus="setDefaultBool(data.autofocus, false)"
				:readonly="setDefaultBool(data.readonly, false)"
			>
			</i-input>
		</template>
		<!-- 2：下拉框 -->
		<template v-else-if="data.type === 2">
			<Select
				v-model="model[data.enName]"
				@on-change="onChange"
				@on-open-change="onOpenChange"
				@on-query-change="onQueryChange"
				:multiple="setDefaultBool(data.multiple, false)"
				:clearable="setDefaultBool(data.clearable, true)"
				:filterable="setDefaultBool(data.filterable, true)"
				:placeholder="data.placeholder || ''"
				:size="data.size || 'default'"
				:not-found-text="data.notFoundText || '无匹配数据'"
				:label-in-value="setDefaultBool(data.labelInValue, false)"
				:placement="data.placement || 'bottom-start'"
				:max-tag-count="data.maxTagCount"
				:id="'es-item-' + data.enName"
				:ref="'es-item-' + data.enName"
				transfer
			>
				<template v-for="item in data.dataSourceList">
					<Option
						v-if="!item.hidden"
						:key="item.value"
						:value="item.value"
						:disabled="setDefaultBool(item.disabled, false)"
					>{{ item.label }}
					</Option
					>
				</template>
			</Select>
		</template>
		<!-- 3：复选框 -->
		<template v-else-if="data.type === 3">
			<CheckboxGroup
				v-model="model[data.enName]"
				@on-change="onChange"
				:size="data.size || 'default'"
			>
				<template v-for="item in data.dataSourceList">
					<Checkbox
						v-if="!item.hidden"
						:label="item.value"
						:key="item.value"
						:disabled="setDefaultBool(item.disabled, false)"
					>{{ item.label }}
					</Checkbox
					>
				</template>
			</CheckboxGroup>
		</template>
		<!-- 4：单选框 -->
		<template v-else-if="data.type === 4">
			<RadioGroup
				v-model="model[data.enName]"
				@on-change="onChange"
				:size="data.size || 'default'"
				:vertical="setDefaultBool(data.vertical, false)"
			>
				<template v-for="item in data.dataSourceList">
					<Radio
						v-if="!item.hidden"
						:label="item.value"
						:key="item.value"
						:disabled="setDefaultBool(item.disabled, false)"
					>{{ item.label }}
					</Radio
					>
				</template>
			</RadioGroup>
		</template>
		<!-- 5：文本域 -->
		<template v-else-if="data.type === 5">
			<i-input
				v-model="data.desensitizeEnName"
				@on-change="onChange"
				type="textarea"
				@on-blur="onBlur"
				@on-focus="onFocus"
				:maxlength="data.maxlength"
				:autosize="setDefaultBoolOrObject(data.autosize, false)"
				:rows="data.rows || 2"
				:placeholder="data.placeholder || ''"
				:wrap="data.wrap || 'soft'"
			/>
		</template>
		<!-- 6：日期选择框 -->
		<!-- timeType可选值为 date、daterange、datetime、datetimerange、year、month -->
		<template v-else-if="data.type === 6">
			<DatePicker
				:value="model[data.enName]"
				:type="data.timeType || 'date'"
				:placeholder="data.placeholder || ''"
				:split-panels="setDefaultBool(data.splitPanels, true)"
				:format="data.format || ''"
				:multiple="setDefaultBool(data.multiple, false)"
				:placement="data.placement || 'bottom-start'"
				:show-week-numbers="setDefaultBool(data.showWeekNumbers, false)"
				:start-date="data.startDate || new Date()"
				:confirm="setDefaultBool(data.confirm, false)"
				:clearable="setDefaultBool(data.clearable, true)"
				:options="data.options"
				@on-change="onChange"
				transfer
			></DatePicker>
		</template>
		<!-- 7：附件 mobile -->
		<!-- 8：上传文件 -->
		<template v-else-if="data.type === 8">
			<es-upload-item
				v-model="model[data.enName]"
				:data="data"
				:model="model"
				@validateField="validateField"
			></es-upload-item>
		</template>
		<!-- 9：下拉树多选 mobile -->
		<!-- 10：下拉框：树结构 -->
		<template v-else-if="data.type === 10">
			<Cascader
				v-model="model[data.enName]"
				@on-change="onChange"
				:data="data.dataSourceList"
				:placeholder="data.placeholder || ''"
				:filterable="setDefaultBool(data.filterable, true)"
				:clearable="setDefaultBool(data.clearable, true)"
				:trigger="data.trigger || 'click'"
				:change-on-select="setDefaultBool(data.changeOnSelect, true)"
				:not-found-text="data.notFoundText || '无匹配数据'"
				:render-format="
                    data.showSingleText ? showSingleText : showMultipleText
                "
				transfer
			></Cascader>
		</template>
		<!-- 11：带搜索的输入框 mobile -->
		<!-- 12：扫一扫 mobile -->
		<!-- 13：普通显示框 mobile -->
		<!-- 14：签名 mobile -->
		<!-- 15：可拨号输入框 mobile -->
		<!-- 16：开关 -->
		<template v-else-if="data.type === 16">
			<i-switch
				v-model="model[data.enName]"
				@on-change="onChange"
				:size="data.size || 'default'"
				class="mt-5"
			>
                <span slot="open">
                    {{ data.openText || '' }}
                </span>
				<span slot="close">
                    {{ data.closeText || '' }}
                </span>
			</i-switch>
		</template>
		<!-- 17：带搜索下拉框 mobile -->
		<!-- 18：复杂item -->
		<template v-else-if="data.type === 18">
			<slot name="itemContent">
				<FormItem
					v-for="item in data.childrenList"
					:key="item.enName"
					:prop="item.enName"
					:rules="handlerRules(item)"
					label=""
				>
					<es-item-content
						:data="item"
						:model="model"
						class="w100"
					></es-item-content>
				</FormItem>
			</slot>
		</template>
		<!-- 19：按钮 -->
		<template v-else-if="data.type === 19">
			<Button
				:type="data.buttonType || 'primary'"
				:ghost="Boolean(data.ghost)"
				:disabled="data.disabled || false"
				:loading="data.loading || false"
				@click="data.click ? data.click() : void 0"
			>
				{{ data.defaultText || 'button' }}
			</Button>
		</template>
		<!-- 20：自定义组件 -->
		<template v-else-if="data.type === 20">
			<slot name="itemContent">
				<component
					v-model="model[data.enName]"
					:is="data.componentName"
				></component>
			</slot>
		</template>
		<!-- 21：文字类型 -->
		<template v-else-if="data.type === 21">
			<div v-html="model[data.enName]"></div>
		</template>
		<!-- 22：分割线 -->
		<template v-else-if="data.type === 22">
			<slot name="itemContent">
				<Divider :orientation="data.orientation" :dashed="data.dashed">
					<div v-html="data.name"></div>
				</Divider>
			</slot>
		</template>
		<!-- 23：卡片form -->
		<template v-else-if="data.type === 23">
			<slot name="itemContent">
				<es-card-form :data="data" :model="model[data.enName]">
					<template slot="cardFormContent" slot-scope="cardSlotProps">
						<template
							v-if="
                                data.dataSource &&
                                    data.dataSource.templetDetailList.length
                            "
						>
							<es-form-item
								v-for="(item, index) in data.dataSource
                                    .templetDetailList"
								:key="index"
								:index="cardSlotProps.index"
								:parentData="data"
								:data="item"
								:model="model[data.enName][cardSlotProps.index]"
								:width="width"
								:labelWidth="labelWidth"
								:editFlag="editFlag"
								:disabledTip="disabledTip"
							></es-form-item>
						</template>
					</template>
				</es-card-form>
			</slot>
		</template>
		<!-- 24：颜色选择器 -->
		<template v-else-if="data.type === 24">
			<ColorPicker
				v-model="model[data.enName]"
				@on-change="onChange"
				:editable="setDefaultBool(data.editable, true)"
				:alpha="setDefaultBool(data.alpha, false)"
				:hue="setDefaultBool(data.hue, true)"
				:recommend="setDefaultBool(data.recommend, false)"
				:colors="data.colors || []"
				:format="data.format || data.alpha ? 'rgb' : 'hex'"
				:placement="data.placement || 'bottom-start'"
			/>
		</template>
		<!-- 25：nfc mobile -->
		<!-- 26：录音与试听 mobile -->
		<!-- -1：栅格 -->
		<template v-else-if="data.type === -1">
			<slot name="itemContent">
				<Row class="w100">
					<i-col
						v-for="(col, colIndex) in data.columns"
						:key="colIndex"
						:span="col.span ? col.span : 0"
					>
						<template
							v-if="
                                col &&
                                    col.list &&
                                    col.list.templetDetailList &&
                                    col.list.templetDetailList.length
                            "
						>
							<es-form-item
								v-for="(item, index) in col.list
                                    .templetDetailList"
								:key="index"
								:data="item"
								:model="model"
								:width="width"
								:labelWidth="labelWidth"
								:editFlag="editFlag"
								:disabledTip="disabledTip"
							></es-form-item>
						</template>
					</i-col>
				</Row>
			</slot>
		</template>
		<slot :name="'endItem-' + data.enName"></slot>
	</div>
</template>
<script>
	import {handlerRules} from '../../../utils';
	import findIndex from 'lodash/findIndex';
	import {isEmpty, desensitize, setDefaultBool, isEmptyObject} from '../../../utils'
	import {
		Row,
		Col,
		ColorPicker,
		Divider,
		Input,
		InputNumber,
		FormItem,
		Switch,
		Cascader,
		RadioGroup,
		Radio,
		Checkbox, CheckboxGroup,
		Select, Option,
		DatePicker
	} from 'view-design'
	import esFormItem from '../formItem'
	// const UploadMaxCount = 10;
	export default {
		name: 'es-item-content',
		components: {
			esFormItem,
			Row,
			'i-col': Col,
			ColorPicker,
			Divider,
			InputNumber,
			FormItem,
			'i-Switch': Switch,
			Select, Option,
			RadioGroup,
			Radio,
			Checkbox, CheckboxGroup,
			Cascader,
			DatePicker,
			'i-input': Input
		},
		props: {
			// 数据源
			data: {
				type: Object,
				default() {
					return {};
				}
			},
			// 双向绑定model
			model: {
				type: Object,
				default() {
					return {};
				}
			},
			// formItem宽度
			width: {
				type: String,
				default: '100%'
			},
			// label宽度
			labelWidth: {
				type: Number
			},
			// 编辑状态 0 - New新建  // 1 - Edit查看编辑 // 2 - Done已完成
			editFlag: {
				type: Number,
				default: 0
			},
			// 是否禁用tooltip
			disabledTip: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {};
		},
		mounted() {
			if (this.data.enName) {
				this.$watch(
					'model.' + this.data.enName,
					(value) => {
						switch (this.data.type) {
							case 0:
								if (typeof value !== 'number') {
									value = Number(value);
								}
								break;
							case 1:
								if (typeof value !== 'string') {
									value = String(value);
								}
								break;
							case 2:
								if (this.data.multiple) {
									if (typeof value === 'string') {
										value = value.split(',');
									}
								} else {
									if (Array.isArray(value)) {
										value.join(',');
									}
								}
								break;
							case 3:
								if (typeof value === 'string') {
									value = value.split(',');
								}
								break;
							default:
								break;
						}
						if (this.data.enName) {
							this.$set(this.model, this.data.enName, value);
							// 赋值给脱敏字段
							this.$set(this.data, 'desensitizeEnName', value);
						}
						if (this.data.desensitizeRegex) {
							this.desensitizeRegexFn();
						}
					},
					{
						immediate: true
					}
				);
			}
			if (this.data.type === 2 && this.data.showInputbar === 1) {
				// setTimeout(() => {
				//     this.$nextTick(() => {
				//         this.$set(this.model, this.data.enName, '2');
				//     });
				// }, 1000);
				document
					.getElementById('es-item-' + this.data.enName)
					.querySelector('input[type="text"]')
					.addEventListener('blur', (e) => {
						let value = e.target.value;
						if (!isEmpty(value)) {
							if (
								findIndex(this.data.dataSourceList, {
									label: value
								}) < 0
							) {
								this.data.dataSourceList.push({
									label: value,
									value: value
								});
								this.$nextTick(() => {
									// todo 调用内部api
									this.$refs[
									'es-item-' + this.data.enName
										].onOptionClick({
										label: value,
										value: value
									});
								});
							} else {
								this.$refs[
								'es-item-' + this.data.enName
									].onOptionClick({
									label: value,
									value: value
								});
							}
						}
					});
			}
		},
		methods: {
			clickIcon(e) {
				this.data.onClick &&
				this.data.onClick.apply(this, [e, this.data, this.model]);
			},
			onOpenChange(flag) {
				this.data.onOpenChange &&
				this.data.onOpenChange.apply(this, [flag]);
			},
			onQueryChange(query) {
				this.data.onQueryChange &&
				this.data.onQueryChange.apply(this, [query]);
			},
			onClear() {
				this.$set(this.model, this.data.enName, '');
				let params = this.model[this.data.enName];
				this.data.onClear && this.data.onClear.apply(this, [params]);
			},
			onFocus() {
				// 获取到焦点，脱敏字段去除；
				this.$set(
					this.data,
					'desensitizeEnName',
					this.model[this.data.enName]
				);
				let params = this.model[this.data.enName];
				this.data.onFocus && this.data.onFocus.apply(this, [params]);
			},
			onBlur() {
				// 脱敏字段赋值
				this.$set(
					this.model,
					this.data.enName,
					this.data.desensitizeEnName
				);
				this.desensitizeRegexFn();
				let params = this.model[this.data.enName];
				this.data.onBlur && this.data.onBlur.apply(this, [params]);
			},
			desensitizeRegexFn() {
				// 脱敏正则。如果存在，开始脱敏
				if (this.data.desensitizeRegex) {
					let desensitizeEnName = desensitize(
						this.data.desensitizeEnName,
						this.data.desensitizeRegex
					);
					this.$set(this.data, 'desensitizeEnName', desensitizeEnName);
				}
			},
			onChange(params) {
				switch (this.data.type) {
					case 1:
						this.data.onChange &&
						this.data.onChange.apply(this, [params.target.value]);
						break;
					case 5:
						this.data.onChange &&
						this.data.onChange.apply(this, [params.target.value]);
						break;
					case 6:
						this.model[this.data.enName] = params;
						this.data.onChange &&
						this.data.onChange.apply(this, [params]);
						break;
					default:
						this.data.onChange &&
						this.data.onChange.apply(this, [params]);
						break;
				}
			},
			// 级联：展示尾端文本值
			showSingleText(list) {
				if (list && list.length > 0) {
					return list[list.length - 1];
				}
			},
			// 级联：展示全部文本值
			showMultipleText(list) {
				if (list && list.length > 0) {
					return list.join('/');
				}
			},
			handlerRules(template) {
				return handlerRules(template);
			},
			setDefaultBool(targetValue, defaultValue) {
				return setDefaultBool(targetValue, defaultValue);
			},
			setDefaultBoolOrObject(targetValue, defaultValue) {
				if (typeof targetValue === 'boolean') {
					return targetValue;
				} else if (typeof targetValue === 'object') {
					if (isEmptyObject(targetValue)) {
						return defaultValue || false;
					} else {
						return targetValue;
					}
				} else {
					return defaultValue || false;
				}
			},
			validateField(params) {
				this.$emit('validateField', params);
			}
		}
	};
</script>
<style lang="scss" scoped>
	.es-item-content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}
</style>
