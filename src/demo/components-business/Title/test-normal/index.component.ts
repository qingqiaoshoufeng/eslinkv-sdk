export const customConfig = [
	{
		prop: 'title',
		label: '标题',
		type: 'func-select',
		options: ['aaaaa', 'hhhhhhh'],
	},
	{
		prop: 'backgrounds',
		label: '组',
		type: 'func-group',
		children: [
			{
				prop: 'background',
				label: '图片',
				type: 'func-image',
			},
			{
				prop: 'title',
				label: '标题',
				type: 'func-input',
			},
		],
	},
]
export const value = {
	api: {
		data: JSON.stringify({ title: '标题' }),
	},
	customEvents: [
		{
			type: 'testEvent',
			name: '自定义事件'
		},
		{
			type: 'test2',
			name: '自定义事件2'
		}
	],
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
		title: 'aaaaa',
		backgrounds: [
			{
				background: '/static/icons/s-progress1-1.svg',
				title: '开户(户)',
			},
		],
	},
}
