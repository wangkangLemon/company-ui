require('./check-versions')()

const config = require('../config')

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn')
const path = require('path')
const Koa = require('koa')
const mount = require('koa-mount')
const koaStatic = require('koa-static')
const webpack = require('webpack')
const webpackConfig = require('./webpack.dev.conf')
const proxy = require('../proxy/app')

// default port where dev server listens for incoming traffic
const port = config.dev.port
// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser

const app = new Koa()

app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        ctx.throw(500, err)
    }
})

if (process.env.MOCK_ENV) {
    const apiConfig = require('../config/config')
    // app.use(require('koa-body')({
    //     patchNode: true
    // }))
    console.log('you are at mock mode')
    app.use(proxy({
        // target: 'http://127.0.0.1:3000',
        target: [JSON.parse(apiConfig.API_HOST_DEV), JSON.parse(apiConfig.API_HOST_ZZA)],
        options: {
            verbose: true
        }
    }))
}

const compiler = webpack(webpackConfig)
const devMiddleware = require('koa-webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
})

// hot load
const hotMiddleware = require('koa-webpack-hot-middleware')(compiler, {
    heartbeat: 2000,
    log: false,
    overlay: false
})

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({action: 'reload'})
        cb()
    })
})

// handle vendor
app.use(koaStatic('./public', {maxAge: 1000 * 60 * 60 * 6}))
app.use(mount('/vendor', koaStatic('../public/vendor', {maxAge: 1000 * 60 * 60 * 6})))
app.use(mount('/upload', koaStatic('../public/upload', {maxAge: 1000 * 60 * 60 * 6})))
// handle fallback for HTML5 history API
app.use(require('koa2-connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(mount(staticPath, koaStatic('./static', {maxAge: 1000 * 60 * 60 * 24})))

var uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(function () {
    console.log('> Listening at ' + uri + '\n')
    // console.log('node mode: ' + process.env.NODE_ENV)
})

module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }

    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri)
    }
    // console.log('> Listening at ' + uri + '\n')
})
