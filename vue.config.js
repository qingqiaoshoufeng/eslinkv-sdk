const path = require('path')
const pkg = require('./package.json')
const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'
const needReport = false

function resolve (dir) {
	return path.join(__dirname, dir)
}
module.exports = {
	transpileDependencies: [
		'@simonwep',
		'vue-draggable-resizable-gorkys2',
		'swiper',
		'dom7'
	],
	assetsDir: 'static',
	publicPath: isProduction ? `/${pkg.version}` : '/',
	outputDir: `dist/${pkg.version}`,
	indexPath: '../index.html',
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
				target: 'http://10.30.3.156:7001',
				changeOrigin: true,
				pathRewrite: {
					'^/node': '/'
				}
			},
			'^/cdn': {
				target: 'http://127.0.0.1:7001',
				// target: 'http://10.30.3.156:7001',
				changeOrigin: true,
				pathRewrite: {
					'^/cdn': '/'
				}
			}
		}
	},
	css: {
		extract: false,
		sourceMap: false,
	},
	configureWebpack: (config) => {
		if (isProduction) {
			config.mode = 'production'
			config.plugins.push(
				new CompressionWebpackPlugin({
					algorithm: 'gzip',
					test: /.js|\.html|.json$|.css/,
					threshold: 10240,
					minRatio: 0.8
				})
			)
		}
		config.resolve.extensions = ['.js', '.vue', '.json', '.ts', '.tsx']
		config.externals = [
			{
				vue: 'Vue',
				'vue-router': 'VueRouter',
				'vue-class-component': 'VueClassComponent',
				echarts: 'echarts'
			}
		]
		config.plugins.push(
			new webpack.DefinePlugin({
				'process.env.staticVuePath': JSON.stringify(isProduction ? 'vue.min.js' : 'vue.js')
			})
		)
	},
	chainWebpack: (config) => {
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
		config.module
			.rule('svg')
			.exclude.add(resolve('src/icons'))
			.end()
		config.module
			.rule('icons')
			.test(/\.svg$/)
			.include.add(resolve('src/icons'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: 'icon-[name]'
			})
			.end()
		if (isProduction) {
			if (needReport) {
				config
					.plugin('webpack-bundle-analyzer')
					.use(
						require('webpack-bundle-analyzer').BundleAnalyzerPlugin
					)
					.end()
			}
			config.plugins.delete('prefetch')
		} else {
			config.resolve.symlinks(true)
		}
	}
}
