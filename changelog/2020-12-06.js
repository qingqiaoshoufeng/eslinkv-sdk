export default {
	version: '1.0.0',
	list: [
		{
			type: ['perf'],
			content: '优化按需引入组件',
		},
		{
			type: ['perf'],
			content: '移除了esvcp-pc，esvcp-pc-ui的强依赖',
		},
		{
			type: ['refactor'],
			content: '添加支持自定义业务组件',
		},
		{
			type: ['refactor'],
			content: '添加场景，支持单页面多状态',
		},
		{
			type: ['refactor'],
			content: '添加主场景，优化场景概念，会有一个常驻场景',
		},
		{
			type: ['fix'],
			content: '修复 animation 支持不填，将取消动画'
		},
		{
			type: ['fix'],
			content: '修复 updateConfig 函数每次组件初始化都会执行，且有setTimeout，组件销毁时容易内存泄漏，不需要执行setTimeout，执行的setTimeout页及时销毁'
		},
		{
			content:'移除setTimeout 自定义组件&比例尺组件 mounted延时700ms执行$forceUpdate函数'
		},
		{
			content:'移除setTimeout html2canvas 强制加的2000ms延迟，为了显示loading动画'
		},
		{
			content:'移除setTimeout 小工具初始化需要时间，此处进行延时逐个回填，强制加的20ms延迟去除'
		},
		{
			content:'移除setTimeout 小工具导入成功，强制加的500ms延迟去除'
		}
	]
}
