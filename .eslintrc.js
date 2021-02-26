module.exports = {
	root: true,
	env: {
		node: true
	},
	'extends': [
		'plugin:vue/essential',
		// 'eslint:recommended',
		// '@vue/typescript/recommended'
	],
	parserOptions: {
		ecmaVersion: 2020
	},
	globals: {
		echarts: true
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'off' : 'off',
		'no-tabs': 0,
		'no-mixed-spaces-and-tabs': 0,
		'indent': ['off', 'tab'],
		'no-trailing-spaces': 1,
		'space-before-function-paren': 0 // 这句话表示在函数后可以不加空格
	}
}
