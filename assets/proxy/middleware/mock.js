const fse = require('fs-extra')
const path = require('path')
const utils = require('../lib/utils')
const decache = require('decache')
const readObj = ({
    file,
    ctx,
    defaultMock,
    options
}) => {
    const jsonName = file + '.json'
    const jsName = file + '.js'
    if (!fse.existsSync(jsonName) && !fse.existsSync(jsName)) {
        options.verbose && utils.log('red', `${file}.js{on} doesn't exists`)
        return false
    }
    try {
        // no cache
        decache(file)
        const obj = require(file)
        options.verbose && utils.log('yellow', `Mock: ${ctx.path}`)
        if (typeof obj === 'function') {
            return obj(ctx)
        }
        return obj
    } catch (err) {
        utils.log('red', err)
        return false
    }
}

module.exports = ({
    ctx,
    options
}) => {
    const asyncMockPath = path.resolve(__dirname, '../mock')
    const defaultMock = {}
    const mockFile = path.join(asyncMockPath, ctx.method.toLowerCase(), ctx.path)
    return readObj({ file: mockFile, ctx, defaultMock, options })
}
