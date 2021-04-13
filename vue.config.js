const path = require('path')
const pkg = require('./package.json')
const isProduction = process.env.NODE_ENV === 'production'
const needReport = false

function resolve(dir) {
	return path.join(__dirname, dir)
}
module.exports = {
	transpileDependencies: ['@simonwep', 'swiper', 'dom7'],
	assetsDir: './',
	publicPath: isProduction ? `/${pkg.version}` : '/',
	outputDir: `dist/${pkg.version}`,
	indexPath: '../index.html',
	filenameHashing: false,
	productionSourceMap: false,
	lintOnSave: false,
	devServer: {
		port: 3000,
		hot: true,
		open: true,
		historyApiFallback: true,
		disableHostCheck: true,
		proxy: {
			'^/node': {
				// target: 'http://127.0.0.1:7001',
				target: 'http://eslinkv.eslink.cc',
				changeOrigin: true,
				// pathRewrite: {
				// 	'^/node': '/',
				// },
			},
			'^/cdn': {
				// target: 'http://127.0.0.1:7001',
				target: 'http://eslinkv.eslink.cc',
				changeOrigin: true,
				// pathRewrite: {
				// 	'^/cdn': '/',
				// },
			},
		},
	},
	css: {
		extract: process.env.VUE_APP_BUILD_MODE === 'NPM',
		sourceMap: false,
	},
	configureWebpack: config => {
		config.resolve.extensions = ['.js', '.vue', '.json', '.ts', '.tsx']
		if (process.env.VUE_APP_BUILD_MODE === 'NPM') {
			config.externals = [
				{
					vue: {
						root: 'Vue',
						commonjs: 'vue',
						commonjs2: 'vue',
						amd: 'vue',
					},
					'vue-router': 'VueRouter',
					'vue-class-component': {
						root: 'VueClassComponent',
						commonjs: 'vue-class-component',
						commonjs2: 'vue-class-component',
						amd: 'vue-class-component',
					},
					echarts: 'echarts',
				},
			]
		} else {
			config.externals = [
				{
					vue: 'Vue',
					'vue-router': 'VueRouter',
					'vue-class-component': 'VueClassComponent',
					echarts: 'echarts',
				},
			]
		}
	},
	chainWebpack: config => {
		config.module
			.rule('vue')
			.use('iview')
			.loader('iview-loader')
			.options({ prefix: false })
		config.resolve.alias.set('@lib', path.resolve(__dirname, './lib'))
		config.module
			.rule('view-design')
			.test(/view-design.src.*?js$/)
			.use('babel')
			.loader('babel-loader')
			.end()
		config.module.rule('svg').exclude.add(resolve('src/icons')).end()
		config.module
			.rule('icons')
			.test(/\.svg$/)
			.include.add(resolve('src/icons'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: 'icon-[name]',
			})
			.end()
		if (isProduction) {
			if (needReport) {
				config
					.plugin('webpack-bundle-analyzer')
					.use(
						require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
					)
					.end()
			}
			config.plugins.delete('prefetch')
		} else {
			config.resolve.symlinks(true)
		}
	},
}
