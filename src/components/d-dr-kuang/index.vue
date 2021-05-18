<template lang="pug">
.dr-line.pos-a
	.dr-line-top.pos-a
	.dr-line-bottom.pos-a
	.dr-line-left.pos-a
	.dr-line-right.pos-a
</template>
<style lang="scss">
.dr-line {
	height: 100%;
	width: 100%;
	top: 0;
	left: 0;
}

.dr-line-top {
	width: 100%;
	height: 1px;
	top: 0;
	left: 0;
}

.dr-line-bottom {
	width: 100%;
	height: 1px;
	bottom: 0;
	left: 0;
}

.dr-line-left {
	width: 1px;
	height: 100%;
	top: 0;
	left: 0;
}

.dr-line-right {
	width: 1px;
	height: 100%;
	top: 0;
	right: 0;
}

.dr-active,
.widget-part-edit:hover {
	.dr-line-top,
	.dr-line-bottom,
	.dr-line-left,
	.dr-line-right {
		background-color: var(--themeColor_08);
	}
}

.dr-active.locked:hover {
	.dr-line-top,
	.dr-line-bottom,
	.dr-line-left,
	.dr-line-right {
		background-color: var(--themeColor_04);
	}
	&::after {
		opacity: 1;
	}
}
</style>
