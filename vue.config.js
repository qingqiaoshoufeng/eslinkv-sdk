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
				// target: 'http://192.168.1.44:2000',
				// target: 'http://10.30.3.156:7001',
				changeOrigin: true,
				// pathRewrite: {
				// 	'^/node': '/',
				// },
			},
			'^/server': {
				// target: 'http://192.168.1.33:9082',
				// target: 'http://10.20.10.154:3000',
				target: 'http://192.168.1.44:2000',
				changeOrigin: true,
				// pathRewrite: {
				// 	'^/server': '/',
				// },
			},
			'^/cdn': {
				// target: 'http://127.0.0.1:7001',
				target: 'http://eslinkv.eslink.cc',
				// target: 'http://10.30.3.156:7001',
				// target: 'http://192.168.1.44:2000',
				changeOrigin: true,
				pathRewrite: {
					'^/cdn': '/',
				},
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
		config.module
			.rule('view-design')
			.test(/view-design.src.*?js$/)
			.use('babel')
			.loader('babel-loader')
			.end()
		config.module.rule('svg').exclude.add(resolve('src/vue2/icons')).end()
		config.module
			.rule('icons')
			.test(/\.svg$/)
			.include.add(resolve('src/vue2/icons'))
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
