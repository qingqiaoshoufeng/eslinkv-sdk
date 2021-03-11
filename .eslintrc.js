module.exports = {
	root: true,
	env: {
		node: true,
		browser: true,
		es6: true,
	},
	extends: [
		'standard',
		'plugin:vue/essential',
		'eslint:recommended',
		'plugin:sonarjs/recommended',
	],
	parserOptions: {
		ecmaVersion: 2020
	},
	plugins: [
		'@typescript-eslint',
		'sonarjs',
	],
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
		'space-before-function-paren': 0 // 在函数后可以不加空格
	}
}
