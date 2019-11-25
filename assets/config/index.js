// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
let apiConfig = require('./config')
let runENV = process.env.RUN_ENV

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../../public/index.html'),
        assetsRoot: path.resolve(__dirname, '../../public'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report,
        // 获取接口地址
        apiHost: (runENV == 'dev' || runENV == 'demo') ? apiConfig.API_HOST_DEV : apiConfig.API_HOST_PROD,
        get payUrl () {
            let map = {
                'demo': '"//paydemo.yst.vodjk.com"',
                'dev': '"//pay.yst.dev.vodjk.com"',
            }
            return map[runENV] ? map[runENV] : '"//pay.yst.vodjk.com"'
        }

    },
    dev: {
        env: require('./dev.env'),
        port: process.env.PORT || 8010,
        autoOpenBrowser: false,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {},
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false,
        // apiHost: process.env.MOCK_ENV ? '"http://127.0.0.1:8010"' : apiConfig.API_HOST_DEV,
        get apiHost () {
            return process.env.MOCK_ENV ? this.apiMockHost : apiConfig.API_HOST_DEV
        },
        get apiMockHost () {
            return JSON.stringify(`${apiConfig.API_HOST_MOCK}:${this.port}`)
        },
        payUrl: '"//pay.yst.dev.vodjk.com"',

    }
}
