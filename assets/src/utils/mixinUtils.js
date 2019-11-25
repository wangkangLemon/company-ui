/**
 * description: 全局混入Vue的mixin方法，Class中定义的方法均为不可枚举原型方法，不需实例化，直接在类上访问prototype
 * author: kangcc@vodjk.com
 */

import authUtils from './authUtils'
import * as timeUtils from './timeUtils'
// import typeUtils from './typeUtils'

class MixinUtils {
    isPermission (val) {
        return authUtils.isPermission(val)
    }

    // AutoComplete输入框后端回传数据适配器
    autoCompleteAdpter (result, name) {
        return result.map((item) => {
            return { value: item[name] }
        })
    }
    // Cascader数据适配器
    caserAdpter (result, name) {
        let arr = []
        result.forEach(item => {
            let obj = {}
            for (let i in item) {
                if (i === 'id') {
                    obj[name] = item[i]
                } else if (i === 'children' && item[i]) {
                    obj[i] = this.caserAdpter(item[i], name)
                } else {
                    obj[i] = item[i]
                }
            }
            arr.push(obj)
        })
        return arr
    }
    // time formatter
    timeFormatter (val, hashour) {
        if (!val) return val
        return timeUtils.date2Str(val, '-', {hashour})
    }

    // len > 7
    truncateStr (str, len = 10, truncateLen = 3) {
        if (len === 0 || !str) {
            return str
        } else if (str.length > len) {
            return `...${str.slice(truncateLen - len, str.length)}`
        }
        return str
    }

    creatorDisabled (creator_id) {
        if (authUtils.getUserInfo().roles.indexOf(201) >= 0 || !creator_id) {
            return false
        }
        return creator_id !== authUtils.getUserInfo().id
    }
}

export default MixinUtils
