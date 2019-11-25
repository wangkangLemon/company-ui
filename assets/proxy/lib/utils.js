const chalk = require('chalk')

/**
 * log with chalk
 * eg: log('green', 'love is a light')
 * @param  {String} color   color of chalk
 * @param  {String} message message of log
 */
exports.log = function (color, message) {
    console.log(chalk[color](message))
}

exports.isJSON = (str) => {
    try {
        if (!str) throw new Error()
        JSON.parse(str)
    } catch (e) {
        return false
    }
    return true
}

exports.isStatic = (path) => {
    return /(hot|webpack|static|(^\/view\/\w*))|\.(js(\.map)?|html|ico|ttf|woff\d*?)$/g.test(path)
}
