<template>
	<div
		ref="imageContainer"
		id="es-imageviewer-container"
		class="image-container"
		v-show="innerShowImageViewer"
	>
		<div class="image-viewer-wrap" @click="clickWrap()">
			<div ref="imageDiv" class="image-div" @click.stop="clickImageDiv">
				<Spin size="large" fix v-if="spinShow"></Spin>
				<div
					class="image-photos"
					ref="imagePhotos"
					@mousewheel="mouseWheelScroll($event)"
				>
					<img
						class="imgContent"
						draggable="false"
						ref="imagePhoto"
						:src="innerImgUrl"
						:alt="imgViewer.alt"
						@click.stop="clickImage()"
						@load="imageLoadSuccess()"
						@error="imageLoadError()"
						@mousedown="mousedown"
						@mouseup="mouseup"
					/>
					<div class="tool-bar">
						<div class="item" @click.stop="rotateBtnClick()">
							<span
								class="rotate esvcp-pc-iconfont esicon-rotate"
							>
							</span>
						</div>
					</div>
					<span
						class="cancelButton iconfont"
						@click.stop="closeSelf()"
						@mouseenter="cancelButtonHighlight = true"
						@mouseleave="cancelButtonHighlight = false"
					>
					</span>
					<span
						class="leftButton esvcp-pc-iconfont esicon-left-arrow"
						v-if="showArrow"
						v-show="innerIndex > 0"
						@click.stop="leftBtnClick()"
					>
					</span>
					<span
						class="rightButton esvcp-pc-iconfont esicon-right-arrow"
						v-if="showArrow"
						v-show="innerIndex < imgViewer.imgUrlList.length - 1"
						@click.stop="rightBtnClick()"
					>
					</span>
					<span class="bottomTitle" @click.stop="clickImage()">
						{{ innerTitle }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'es-image-viewer',
	props: {},

	data() {
		this.imageDOM = null;
		this.imagePositionX = 0;
		this.imagePositionY = 0;

		return {
			imgViewer: { imgUrlList: [], index: 0 },
			imgViewerDefaultOpts: {
				// 图片链接数组
				imgUrlList: [],
				// 当前图片索引
				index: 0,
				// 图片alt描述
				alt: '图片',
				// 底部文字描述
				title: '图片',
				// 点击空白处是否可关闭
				closable: false,
				// 是否可循环浏览图片
				cyclical: false,
			},
			innerShowImageViewer: true,
			innerIndex: 0,
			innerImgUrl: '',
			innerTitle: '',
			isLoadError: false,
			showArrow: true,
			spinShow: true,
			cancelButtonHighlight: false,
			position: {
				offsetX: 0, // 点击处偏移元素的X
				offsetY: 0, // 偏移Y值
				state: 0, // 是否正处于拖拽状态，1表示正在拖拽，0表示释放
			},
			degree: 0,
		};
	},

	methods: {
		setIndex(index) {
			const currentImgUrlList = this.imgViewer.imgUrlList;
			let tempValue = Number(index);
			let element = this.$refs.imageDiv;
			if (element && element.style) {
				element.style.top = '';
				element.style.left = '';
			}

			if (tempValue < 0) {
				tempValue = 0;
			}
			if (tempValue > currentImgUrlList.length) {
				tempValue = currentImgUrlList.length - 1;
			}

			this.innerIndex = tempValue;
			if (this.innerImgUrl === currentImgUrlList[tempValue]) {
				this.spinShow = false;
			} else {
				this.spinShow = true;
				this.innerImgUrl = currentImgUrlList[tempValue];
				// this.$set(
				//     this._data,
				//     'innerImgUrl',
				//     currentImgUrlList[tempValue]
				// );
			}
			this.innerTitle =
				this.imgViewer.title +
				' ' +
				(tempValue + 1) +
				'/' +
				currentImgUrlList.length;
		},

		open(imgViewer) {
			// Listen mouse move event on window
			window.addEventListener('mousemove', this.mousemove);

			this.imgViewer = Object.assign(
				{},
				this.imgViewerDefaultOpts,
				imgViewer
			);
			this.innerShowImageViewer = true;
			this.showArrow = imgViewer.imgUrlList.length > 1;
			this.imgViewer.imgUrlList = imgViewer.imgUrlList;
			// const currentimgUrlList = [].concat(imgViewer.imgUrlList);
			// imgViewer.imgUrlList = [];
			// imgViewer.imgUrlList = currentimgUrlList;
			let tempValue = Number(imgViewer.index);
			let element = this.$refs.imageDiv;
			if (element && element.style) {
				element.style.top = '';
				element.style.left = '';
			}

			if (tempValue < 0) {
				tempValue = 0;
			}

			if (tempValue > imgViewer.imgUrlList.length) {
				tempValue = imgViewer.imgUrlList.length - 1;
			}

			console.log(tempValue);
			if (this.innerImgUrl === imgViewer.imgUrlList[tempValue]) {
				this.spinShow = false;
			} else {
				this.spinShow = true;
				this.$set(
					this._data,
					'innerImgUrl',
					imgViewer.imgUrlList[tempValue]
				);
			}
			this.innerTitle =
				imgViewer.title +
				' ' +
				(tempValue + 1) +
				'/' +
				imgViewer.imgUrlList.length;

			this.setIndex(tempValue);
		},

		// 图片加载完成
		imageLoadSuccess: function () {
			this.fixImageSize();
			this.spinShow = false;
			this.isLoadError = false;
			this.$emit('imageLoadSuccess', this.innerIndex);
		},

		// 图片加载失败
		imageLoadError: function () {
			this.innerImgUrl = require('../../assets/img/img-load-error.png');
			this.innerTitle += ' - 图片加载失败';
			this.fixImageSize();
			this.spinShow = false;
			this.isLoadError = true;
			this.$emit('imageLoadError', this.innerIndex);
		},

		// 调整图片尺寸
		fixImageSize: function () {
			this.$refs.imagePhoto.style.width = '';
			this.$refs.imagePhoto.style.height = '';
			this.$refs.imageDiv.style.width = '';
			this.$refs.imageDiv.style.height = '';
			this.$refs.imagePhotos.style.width = '';
			this.$refs.imagePhotos.style.height = '';
			this.degree = 0;
			this.$refs.imagePhoto.style.transform = '';
			let imageDom = this.$refs.imagePhoto;
			imageDom.width = imageDom.naturalWidth || 300;
			imageDom.height = imageDom.naturalHeight || 300;
			let width = imageDom.width;
			let height = imageDom.height;
			let maxWidth = document.body.clientWidth;
			let maxHeight = document.body.clientHeight;
			let widthRate = width / maxWidth;
			let heightRate = height / maxHeight;
			if (widthRate >= 0.9 || heightRate >= 0.9) {
				if (widthRate >= heightRate) {
					let tempRate = width / ((maxWidth * 3) / 4);
					width = (maxWidth * 3) / 4;
					imageDom.width = width;
					imageDom.height = height / tempRate;
				} else {
					let tempRate = height / ((maxHeight * 3) / 4);
					height = (maxHeight * 3) / 4;
					imageDom.width = width / tempRate;
					imageDom.height = height;
				}
			} else if (widthRate <= 0.2 || heightRate <= 0.2) {
				if (widthRate >= heightRate) {
					let tempRate = Number(maxWidth) / 2 / width;
					width = Number(maxWidth) / 2;
					imageDom.width = width;
					imageDom.height = height * tempRate;
				} else {
					let tempRate = Number(maxHeight) / 2 / height;
					height = Number(maxHeight) / 2;
					imageDom.width = width * tempRate;
					imageDom.height = height;
				}
			}
			imageDom.style.height = imageDom.height + 'px';
			imageDom.style.width = imageDom.width + 'px';
		},

		// 点击事件
		clickWrap: function () {
			console.log(111, this.closable);
			if (this.closable) {
				this.closeSelf();
			}
		},

		clickImageDiv: function () {},

		clickImage: function () {
			this.$emit('clickImage', this.innerIndex);
		},

		// 关闭按钮
		clickCloseIcon: function () {
			this.closeSelf();
		},

		// 旋转
		rotateBtnClick() {
			this.degree += -90;
			this.$refs.imagePhoto.style.transform =
				'rotate(' + this.degree + 'deg)';
			this.mouseWheelScroll();
		},

		// 左翻页
		leftBtnClick: function () {
			let imgUrlList = this.imgViewer.imgUrlList;
			if (this.innerIndex > 0) {
				this.innerIndex--;
			} else {
				if (this.cyclical) {
					this.innerIndex = imgUrlList.length - 1;
				} else {
					this.innerIndex = 0;
				}
			}

			this.setIndex(this.innerIndex);
		},

		// 右翻页
		rightBtnClick: function () {
			let imgUrlList = this.imgViewer.imgUrlList;
			let totalCount = imgUrlList.length;
			if (this.innerIndex < totalCount - 1) {
				this.innerIndex++;
			} else {
				if (this.cyclical) {
					this.innerIndex = 0;
				} else {
					this.innerIndex = imgUrlList.length - 1;
				}
			}

			this.setIndex(this.innerIndex);
		},

		// 关闭
		closeSelf: function () {
			this.reset();
			// this.innerIndex = 0;
			this.innerShowImageViewer = false;
			window.removeEventListener('mousemove', this.mousemove);
			this.$emit('closeImageViewer', this.innerShowImageViewer);
		},

		// 重置
		reset: function () {
			this.position = {
				offsetX: 0, // 点击处偏移元素的X
				offsetY: 0, // 偏移Y值
				state: 0, // 是否正处于拖拽状态，1表示正在拖拽，0表示释放
			};
		},

		// 移动事件
		mousedown: function (event) {
			// 获取鼠标点击时，当前图片左侧和顶部距离可视距离的位置;
			this.imagePositionX =
				event.clientX - this.$refs.imageDiv.offsetLeft;
			this.imagePositionY = event.clientY - this.$refs.imageDiv.offsetTop;

			// 获得偏移的位置以及更改状态
			let e = this.getEvent(event);
			let x;
			let y;
			let w = this.$refs.imagePhoto.width;
			let h = this.$refs.imagePhoto.height;
			switch ((this.degree / 90) % 4) {
				case 0:
					x = e.offsetX;
					y = e.offsetY;
					break;
				case 1:
					x = h - e.offsetY;
					y = e.offsetX;
					break;
				case 2:
					x = w - e.offsetX;
					y = h - e.offsetY;
					break;
				case 3:
					x = e.offsetY;
					y = w - e.offsetX;
					break;
				default:
					break;
			}
			this.position.offsetX = x;
			this.position.offsetY = y;
			this.position.state = 1;
		},

		mouseup: function (event) {
			this.position.state = 0;
		},

		mousemove: function (event) {
			let e = this.getEvent(event);

			if (this.position.state === 1) {
				const element = this.$refs.imageDiv;
				const x = e.clientX - this.imagePositionX;
				const y = e.clientY - this.imagePositionY;
				const documentWidth = document.documentElement.clientWidth;
				const documentHeight = document.documentElement.clientHeight;

				this.position.x = x;
				this.position.y = y;

				if (x < 0) {
					this.position.x = 0;
				} else if (x >= documentWidth - element.offsetWidth) {
					this.position.x = documentWidth - element.offsetWidth;
				}

				if (y < 0) {
					this.position.y = 0;
				} else if (y >= documentHeight - element.offsetHeight) {
					this.position.y = documentHeight - element.offsetHeight;
				}

				element.style.left = this.position.x + 'px';
				element.style.top = this.position.y + 'px';
			}
		},

		// 鼠标滚轮事件
		mouseWheelScroll(e) {
			let imageDiv = this.$refs.imageDiv;
			let image = this.$refs.imagePhoto;
			let imagePhotos = this.$refs.imagePhotos;
			let width = image.width;
			let height = image.height;
			let imgW = width;
			let imgH = height;
			// 放大 滚轮下滑
			if (e) {
				if (e.deltaY < 0) {
					if (width < 2000) {
						imgW = width * 1.025;
						imgH = height * 1.025;
					}
				} else {
					// 缩小 滚轮上滑
					if (width > 300) {
						imgW = width * 0.975;
						imgH = height * 0.975;
					}
				}
			}
			image.height = Math.round(imgH);
			image.width = Math.round(imgW);
			image.style.height = Math.round(imgH) + 'px';
			image.style.width = Math.round(imgW) + 'px';
			if ((this.degree / 90) % 2 !== 0) {
				imageDiv.style.height = Math.round(imgW) + 'px';
				imageDiv.style.width = Math.round(imgH) + 'px';
			} else {
				imageDiv.style.height = Math.round(imgH) + 'px';
				imageDiv.style.width = Math.round(imgW) + 'px';
			}
			imagePhotos.style.height = imageDiv.style.height;
			imagePhotos.style.width = imageDiv.style.width;
			let offsetLeft = imageDiv.offsetLeft;
			let offsetTop = imageDiv.offsetTop;
			imageDiv.style.left =
				String(offsetLeft - (imgW - width) / 2) + 'px';
			imageDiv.style.top = String(offsetTop - (imgH - height) / 2) + 'px';
		},
		getEvent: function (event) {
			return event || window.event;
		},
	},

	mounted() {
		this.fixImageSize();
	},

	watch: {
		// innerIndex: {
		//     handler: function(newValue, oldValue) {
		//         this.innerImgUrl = this.imgViewer.imgUrlList[newValue];
		//         // this.setIndex(newValue);
		//     },
		//     immediate: true
		// }
		// 'imgViewer.imgUrlList': {
		//     handler(value) {
		//         this.showArrow = value.length > 1;
		//
		//         this.setIndex(this.imgViewer.innerIndex);
		//     },
		//     deep: true,
		//     immediate: true
		// }
		// showImageViewer: {
		//     handler(value) {
		//         this.isShowImageViewer = value;
		//     },
		//     immediate: true
		// }
	},
	computed: {
		// innerShowImageViewer: {
		//     get() {
		//         return this.showImageViewer;
		//     },
		//     set(value) {}
		// }
	},
};
</script>

<style rel="stylesheet/scss" scoped lang="scss" type="text/css">
.icon-guanbi,
.icon-guanbi-highlight {
	font-size: 32px;
}

.image-container {
	position: fixed;
	z-index: 10000;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: rgba(55, 55, 55, 0.6);
	height: 100%;
	width: 100%;
}

.image-viewer-mask {
	position: fixed;
	z-index: 10000;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: rgba(55, 55, 55, 0.6);
	height: 100%;
}

.image-viewer-wrap {
	position: fixed;
	overflow: hidden;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 10000;
	display: flex;
	align-items: center;
	justify-content: center;

	.esicon-left-arrow,
	.esicon-right-arrow {
		transition: all 0.3s linear;
	}

	.image-div {
		text-align: center;
		margin: auto;
		position: absolute;
		background-color: #fff;
		.image-photos {
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			&:hover > .leftButton {
				opacity: 0.4;
			}
			&:hover > .rightButton {
				opacity: 0.4;
			}
			&:hover > .bottomTitle {
				opacity: 0.8;
			}
			.imgContent {
				cursor: move;
				transform-origin: center center;
			}
			.cancelButton {
				width: 32px;
				height: 32px;
				position: absolute;
				top: -16px;
				right: -16px;
				transition: all 0.2s ease;
				background: url(../../assets/img/img-viewer-cancel.png) round;
				&:hover {
					background: url(../../assets/img/img-viewer-cancel-highlight.png)
						round;
				}
				z-index: 10100;
				cursor: pointer;
			}
			.leftButton {
				height: 68px;
				position: absolute;
				top: 0;
				bottom: 0;
				margin-top: auto;
				margin-bottom: auto;
				left: 0;
				background-repeat: repeat;
				opacity: 0;
				z-index: 10100;
				font-size: 68px;
				cursor: pointer;
				&:hover {
					opacity: 1;
				}
			}
			.rightButton {
				height: 68px;
				position: absolute;
				top: 0;
				bottom: 0;
				margin-top: auto;
				margin-bottom: auto;
				right: 0;
				background-repeat: repeat;
				opacity: 0;
				z-index: 10100;
				font-size: 68px;
				cursor: pointer;
				&:hover {
					opacity: 1;
				}
			}
			.bottomTitle {
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				height: 32px;
				line-height: 32px;
				background-color: rgba(0, 0, 0, 0.8);
				color: #fff;
				overflow: hidden;
				font-size: 12px;
				text-align: center;
				opacity: 0;
				z-index: 10100;
				transition: all 0.3s linear;
			}
		}
	}
}

.tool-bar {
	position: absolute;
	z-index: 10100;
	left: 0;
	top: 0;
	.item {
		height: 36px;
		width: 36px;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
}

.rotate {
	font-size: 22px;
	color: #ffffff;
}
</style>
