// const config = require('../../config')

const httpProxy = require('http-proxy')
const http = require('http')
const utils = require('../lib/utils')

module.exports = ({
    ctx,
    target,
    options
}) => {
    options.verbose && utils.log('yellow', `Proxy: ${ctx.method} ${ctx.path}`)
    const proxy = httpProxy.createProxyServer({
        target,
        headers: {
            'accept-encoding': 'en-GB,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
            'x-proxy-header': 'true',
            'host': target.match(/^https?:\/{2}([^\s/]*)/)[1],
            'origin': target
        },
    })
    proxy.on('error', (err, req, res) => {
        res.emit('proxyError', err)
    })
    proxy.on('end', (req, res, proxyRes) => {
        res.emit('proxyEnd')
    })
    proxy.on('proxyReq', (proxyReq, req, res, options) => {
        proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded')
        // if (ctx.req.body) {
        //     let bodyData = JSON.stringify(ctx.req.body)
        //     proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
        //     // stream the content
        //     proxyReq.write(bodyData)
        // }
    })
    return (ctx) => {
        // 通过ServerResponse构建一个res，传入proxy，封装write方法，
        // 在有数据的时候将返回的值写入res,然后传给外边koa的ctx.body
        const res = new http.ServerResponse(ctx.req)
        const bodyBuffers = []
        res.write = chunk => {
            bodyBuffers.push(chunk)
            return true
        }
        return new Promise((resolve, reject) => {
            proxy.web(ctx.req, res)
            res.on('proxyEnd', () => {
                res.body = Buffer.concat(bodyBuffers).toString('utf8')
                resolve(res)
            })
            res.on('proxyError', err => {
                reject(err)
            })
        })
    }
}
