// middleware that the dev-server uses
const mock = require('./middleware/mock')
const proxy = require('./middleware/proxy')
const config = require('../config')
const utils = require('./lib/utils')

module.exports = ({
    target,
    options
}) => {
    return async (ctx, next) => {
        options.verbose && utils.log('green', `Mock: ${config.dev.apiHost}`)
        if (!utils.isStatic(ctx.path)) {
            let data = mock({ ctx, options })
            if (data) {
                ctx.set('Content-Type', 'application/json')
                ctx.body = JSON.stringify(data)
            } else {
                for (const t of target) {
                    options.verbose && utils.log('yellow', `Target: ${t}`)
                    let proxyRes = await proxy({ ctx, target: t, options })(ctx)
                    if (proxyRes.statusCode == 200) {
                        ctx.status = proxyRes.statusCode
                        ctx.set(proxyRes._headers)
                        let body = proxyRes.body
                        ctx.body = body
                        break
                    } else {
                        options.verbose && utils.log('gray', '无该url，loop请求, prepare redirect')
                    }
                }
            }
        } else {
            await next()
        }
    }
}
