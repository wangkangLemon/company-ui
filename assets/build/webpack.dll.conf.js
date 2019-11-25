/**
 * Created by huanghuixin on 2017/5/8.
 */
const webpack = require('webpack')
const path = require('path')
var config = require('../config')

const vendors = [
    '@fdaciuk/ajax',
    'cropperjs',
    'echarts',
    'element-ui/lib',
    'eventsource-polyfill',
    'promise',
    'vue',  // 打包时只需打包运行时，不需要打包完整版
    'vue-router',
    'vuex',
    './src/assets/js/area.js',
    './src/assets/js/city.js',
    './src/assets/js/province.js',
    './src/assets/js/region.js'
]

module.exports = {
    output: {
        path: path.resolve('./public'),
        filename: '[name].js',
        library: '[name]',
    },
    entry: {
        vendor: vendors,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.build.env,
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
        }),
        new webpack.DllPlugin({
            path: './build/manifest.json',
            name: '[name]',
            context: path.resolve('./'),
        }),
    ]
}

console.info(__dirname)
