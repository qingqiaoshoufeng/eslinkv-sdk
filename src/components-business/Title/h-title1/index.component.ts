export const customConfig = [
	{
		prop: 'background',
		label: '组',
		type: 'func-group',
		children: [
			{
				prop: 'title',
				label: '标题',
				type: 'func-input',
			},
			{
				prop: 'background',
				label: '背景图片',
				type: 'func-background',
				options: [
					'/static/icons/s-progress1-1.svg',
					'/static/icons/s-progress1-2.svg',
					'/static/icons/s-progress1-3.svg',
				],
			},
		],
	},
	{
		prop: 'abc',
		label: '背景图片',
		type: 'func-background',
		options: [
			'/static/icons/s-progress1-1.svg',
			'/static/icons/s-progress1-2.svg',
			'/static/icons/s-progress1-3.svg',
		],
	},
]
export const value = {
	api: {
		data: JSON.stringify({ title: '标题' }),
	},
	layout: {
		size: {
			width: 480,
			height: 43,
		},
		position: {
			value: 'relative',
		},
	},
	config: {
		background: [
			{
				background: '/static/icons/s-progress1-1.svg',
				title: '开户(户)',
			},
		],
		colorTheme: {},
		abc: '/static/icons/s-progress1-1.svg',
	},
}
