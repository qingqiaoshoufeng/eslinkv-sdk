<template>
	<div class="upload-item">
		<div class="upload-wrapper">
			<div
				v-for="(item, index) in uploadList"
				:class="{
                    'upload-list': true,
                    'normal-file': !isPicType(item)
                }"
				:key="index"
			>
				<template v-if="item.status === 'uploading'">
					<Progress
						v-if="item.showProgress"
						:percent="item.percentage"
						hide-info
					></Progress>
				</template>
				<template v-else>
					<template v-if="isPicType(item)">
						<img :src="item.photoUrl"/>
						<div class="upload-list-cover">
							<div
								:style="{
                                    height:
                                        imgUrlList && imgUrlList.length > 1
                                            ? '30px'
                                            : '60px',
                                    'line-height':
                                        imgUrlList && imgUrlList.length > 1
                                            ? '30px'
                                            : '60px'
                                }"
							>
								<Icon
									type="ios-eye-outline"
									@click.native="handleView(item, index)"
								></Icon>
								<Icon
									type="ios-trash-outline"
									@click.native="handleRemove(item, index)"
								></Icon>
							</div>
							<div
								v-if="imgUrlList && imgUrlList.length > 1"
								style="height:30px;line-height:30px;"
							>
								<Icon
									type="ios-arrow-round-back"
									@click.native="forward(item, index)"
								></Icon>
								<Icon
									type="ios-arrow-round-forward"
									@click.native="backward(item, index)"
								></Icon>
							</div>
						</div>
					</template>
					<template v-else>
						<span>{{ item.fileName || item.name }}</span>
						<div class="upload-list-cover">
							<Icon
								type="ios-trash-outline"
								@click.native="handleRemove(item, index)"
							></Icon>
						</div>
					</template>
				</template>
			</div>
			<!-- defaultFileList不能置成空数组 -->
			<Upload
				v-show="needShow"
				:action="data.action"
				:headers="data.headers"
				:multiple="setDefaultBool(data.multiple, false)"
				:data="data.data"
				:name="data.fileName || 'file'"
				:with-credentials="setDefaultBool(data.withCredentials, false)"
				:show-upload-list="setDefaultBool(data.showUploadList, false)"
				:type="data.interactionType || 'select'"
				:accept="data.accept"
				:format="data.format || ['jpg', 'jpeg', 'png']"
				:max-size="data.maxSize || 2048"
				:before-upload="beforeUpload"
				:on-success="onSuccess"
				:on-error="onError"
				:on-format-error="onFormatError"
				:on-exceeded-size="onExceededSize"
				:default-file-list="data.defaultValue"
				class="load"
				ref="upload"
			>
				<div class="load-icon" ref="loadIcon">
					<Icon type="ios-add" size="25"></Icon>
				</div>
			</Upload>
		</div>
		<!-- 图片浏览 -->
		<es-image-viewer
			v-if="showImageViewer"
			:imgUrlList="imgUrlList"
			:index="imgIndex"
			@closeImageViewer="showImageViewer = false"
		>
		</es-image-viewer>
	</div>
</template>
<script>
	import {Upload, Icon, Progress} from 'view-design'
	import esImageViewer from '../es-image-viewer'
	import {deepCopy, setDefaultBool, isImageUrl} from '../../utils'

	const UploadMaxCount = 10;
	export default {
		name: 'es-upload-item',
		components: {
			Upload, Icon, Progress, esImageViewer
		},
		props: {
			data: {
				type: Object,
				default() {
					return {};
				}
			},
			model: {
				type: Object,
				default() {
					return {};
				}
			}
		},
		data() {
			return {
				showImageViewer: false,
				imgIndex: 0,
				uploadList: []
			};
		},
		mounted() {
			this.$watch(
				'model.' + this.data.enName,
				(value) => {
					if (typeof value === 'string') {
						try {
							value = JSON.parse(value);
						} catch (error) {
							console.error(error);
						}
					}
					this.$nextTick(() => {
						this.$refs.upload.fileList = value || [];
						this.uploadList = this.$refs.upload.fileList;
					});
				},
				{
					immediate: true
				}
			);
		},
		methods: {
			setDefaultBool(targetValue, defaultValue) {
				return setDefaultBool(targetValue, defaultValue);
			},
			// upload
			// 上传图片类型，与上传其他文件类型，交互不同
			isPicType(file) {
				if (
					isImageUrl(
						file.photoUrl || file.name || file.fileName || ''
					)
				) {
					return true;
				} else {
					return false;
				}
			},
			// 查看图片
			handleView(img, index) {
				this.imgIndex = this.imgUrlList.indexOf(img.photoUrl);
				this.showImageViewer = true;
			},
			// 删除图片
			handleRemove(img, index) {
				this.$refs.upload.fileList.splice(index, 1);
			},
			// 向前调整顺序
			forward(img, index) {
				if (index > 0) {
					let temp = deepCopy(
						this.$refs.upload.fileList[index]
					);
					this.$refs.upload.fileList.splice(index, 1);
					this.$refs.upload.fileList.splice(index - 1, 0, temp);
				} else {
					let temp = this.$refs.upload.fileList[0];
					this.$refs.upload.fileList.splice(0, 1);
					this.$refs.upload.fileList.push(temp);
				}
				this.$set(this._data, 'uploadList', this.$refs.upload.fileList);
			},
			// 向后调整顺序
			backward(img, index) {
				if (index < this.$refs.upload.fileList.length - 1) {
					let temp = deepCopy(
						this.$refs.upload.fileList[index]
					);
					this.$refs.upload.fileList.splice(index, 1);
					this.$refs.upload.fileList.splice(index + 1, 0, temp);
				} else {
					let temp = this.$refs.upload.fileList[
					this.$refs.upload.fileList.length - 1
						];
					this.$refs.upload.fileList.splice(
						this.$refs.upload.fileList.length - 1,
						1
					);
					this.$refs.upload.fileList.splice(0, 0, temp);
				}
				this.$set(this._data, 'uploadList', this.$refs.upload.fileList);
			},
			// 上传前的钩子，返回false取消上传
			async beforeUpload(file) {
				let unUpload = this.data.unUpload;

				function getImage() {
					return new Promise(function (resolve, reject) {
						let filereader = new FileReader();
						filereader.onload = (e) => {
							let src = e.target.result;
							const image = new Image();
							image.onload = (e) => {
								let target = e.target;
								file.width = target.width;
								file.height = target.height;
								file.naturalWidth = target.naturalWidth;
								file.naturalHeight = target.naturalHeight;
								if (unUpload) {
									file.photoUrl = src;
								}
								resolve();
							};
							image.onerror = reject;
							image.onabort = reject;
							image.src = src;
						};
						filereader.onabort = reject;
						filereader.onerror = reject;
						filereader.readAsDataURL(file);
					});
				}

				if (unUpload) {
					if (file.type.startsWith('image')) {
						await getImage();
					}
					this.data.beforeUpload &&
					this.data.beforeUpload.apply(this, [file]);
					this.$refs.upload.fileList.push(file);
					throw new Error("can't upload");
				} else {
					let maxCount = this.data.maxCount || UploadMaxCount;
					let flag = this.uploadList.length < maxCount;
					let flagTemplate = true;
					if (!flag) {
						this.$Message.error('最多上传' + maxCount + '张图片');
					}
					if (this.data.beforeUpload) {
						if (file.type.startsWith('image')) {
							await getImage();
						}
						flagTemplate = this.data.beforeUpload.apply(this, [file]);
					}
					if (flag && flagTemplate) {
						return true;
					} else {
						throw new Error("can't upload");
					}
				}
			},
			// 上传成功
			onSuccess(response, file, fileList) {
				if (response.responseCode === '100000') {
					if (typeof response.result === 'string') {
						file.photoUrl = response.result;
						file.photoKey = '';
						file.fileName = '';
					} else {
						file.photoUrl = response.result.photoUrl;
						file.photoKey = response.result.photoKey;
						file.fileName = response.result.fileName;
					}
					delete file.response;
					this.data.onSuccess &&
					this.data.onSuccess.apply(this, [response, file, fileList]);
				} else {
					fileList.pop();
					this.$Message.error(response.message || '上传失败，请稍后再试');
					delete file.response;
					this.data.onError &&
					this.data.onError.apply(this, [
						new Error(response.message),
						file,
						fileList
					]);
				}
			},
			// 上传失败
			onError(error, file, fileList) {
				this.$Message.error('上传失败，请稍后再试');
				this.data.onError &&
				this.data.onError.apply(this, [error, file, fileList]);
			},
			// 格式校验错误
			onFormatError(file, fileList) {
				let msg = this.data.format || ['jpg', 'jpeg', 'png'];
				this.$Message.error('文件格式错误，请上传' + msg + '格式文件');
				this.data.onFormatError &&
				this.data.onFormatError.apply(this, [file, fileList]);
			},
			// 超出大小限制
			onExceededSize(file, fileList) {
				let msg = this.data.maxSize || 2048;
				this.$Message.error('文件过大，请上传' + msg + 'kb以内的文件');
				this.data.onExceededSize &&
				this.data.onExceededSize.apply(this, [file, fileList]);
			},
			isEquleFileList(list, otherList) {
				let flag = true;
				if (list.length === otherList.length) {
					list.forEach((item, index) => {
						if (item.photoUrl !== otherList[index].photoUrl) {
							flag = false;
						}
					});
				} else {
					flag = false;
				}
				return flag;
			}
		},
		watch: {
			uploadList: {
				handler(value) {
					console.log(
						'itemContent change: uploadList = ' +
						value.length +
						', ' +
						this.data.enName +
						this.data.id
					);
					this.$set(this.model, this.data.enName, value || []);
					// todo 上传的item项校验失效问题
					if (value && value.length > 0) {
						this.$emit('validateField', this.data.enName);
						// this.$parent.$parent.$parent.$parent.$parent.$parent
						//     .validateField(this.data.enName)
						//     .then((data) => {})
						//     .catch((data) => {});
					}
				}
			}
		},
		computed: {
			imgUrlList: {
				get() {
					let list = this.uploadList.filter((item) => {
						if (
							isImageUrl(
								item.photoUrl || item.name || item.fileName || ''
							)
						) {
							return item;
						}
					});
					return list.map((item) => {
						return item.photoUrl;
					});
				},
				set() {
				}
			},
			// 是否展示上传按钮
			needShow: {
				get() {
					if (
						this.uploadList.length <
						(this.data.maxCount || UploadMaxCount)
					) {
						return true;
					} else {
						return false;
					}
				},
				set() {
				}
			}
		}
	};
</script>
<style lang="scss" scoped></style>
