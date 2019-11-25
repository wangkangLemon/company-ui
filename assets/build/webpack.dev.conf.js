// var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const Jarvis = require('webpack-jarvis')

// var manifiest = require('./manifest.json')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap})
    },
    // cheap-module-eval-source-map is faster for development
    // devtool: 'cheap-module-eval-source-map',
    devtool: 'cheap-source-map',
    plugins: [
        // new webpack.DllReferencePlugin({
        //     context: path.resolve('./'),
        //     manifest: manifiest,
        // }),
        new webpack.ProvidePlugin({
            Promise: 'promise',
            'window.Promise': 'promise'
        }),
        new webpack.DefinePlugin({
            'process.env': config.dev.env,
            'process.apiHost': config.dev.apiHost,
            'process.buildTime': '"' + new Date().toLocaleString() + '"',
            'process.oldCompanyDomain': '"http://admin.yst.dev.vodjk.com"',
            'process.payUrl': config.dev.payUrl

        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            // filename: 'index.html',
            template: 'src/index.html',
            inject: true,
            // vendorjs: '/' + manifiest.name + '.js?v=' + utils.getMd5(path.resolve('./public/vendor.js'))
        }),
        new FriendlyErrorsPlugin(),
        // new Jarvis({
        //     port: 1337
        // })
    ]
})
