/**
 * 判断数据类型
 */
export function typeOf (o) {
    return o == null ? String(o) : ({}).toString.call(o).slice(8, -1).toLowerCase()
}

/**
 * 深度克隆
 * @param  {Object} obj
 * @return {Object} newobj
 */
export function clone (obj) {
    let type = typeOf(obj)
    switch (type) {
    case 'object':
        var cloned = {}
        for (let i in obj) {
            cloned[i] = clone(obj[i])
        }
        return cloned
    case 'array':
        return obj.map(clone)
    default:
        return obj
    }
}
