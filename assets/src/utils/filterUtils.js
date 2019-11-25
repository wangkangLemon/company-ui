import Vue from 'vue'
import * as timeUtils from '../utils/timeUtils'
import config from './config'

// 默认头像
export const defaultAvatar = Vue.filter('defaultAvatar', function (urlObj) {
    if (!urlObj) return ''
    if (urlObj.url && urlObj.url.indexOf('/user-default') == -1) {
        let apiUrl = config.apiHost.replace(/(^")|("$)/g, '')
        return urlObj.url.indexOf('://') > -1 ? urlObj.url : apiUrl + urlObj.url
    } else {
        if (urlObj.sex) {
            // 男默认头像
            return require('../assets/images/user-default-male.jpg')
        }
        // 女默认头像
        return require('../assets/images/user-default-female.jpg')
    }
})

// 时间戳转字符串
export const tamp2Str = Vue.filter('tamp2Str', function (timetamp) {
    return timeUtils.getTimespanDesc(timetamp, false)
})

// 填充图片的url
export const fillImgPath = Vue.filter('fillImgPath', function (url) {
    if (!url) return url
    let apiUrl = config.apiHost.replace(/(^")|("$)/g, '')
    return url.indexOf('://') > -1 ? url : apiUrl + url
})

export const fillZero = Vue.filter('fillZero', function (orignStr, maxLength = 2) {
    if (!orignStr) {
        return
    }
    orignStr = orignStr + '' // 将非字符串转为字符串
    let zeroCount = maxLength - orignStr.length
    let zeroStr = ''
    for (let i = 0; i < zeroCount; i++) {
        zeroStr = zeroStr + '0'
    }

    return zeroStr + orignStr
})

export const taskType = Vue.filter('taskType', (val, type) => {
    let map = {
        course: {
            label: '课程',
            tag: ''
        },
        public: {
            label: '公开',
            tag: 'success'
        },
        private: {
            label: '内训',
            tag: ''
        },
        industry: {
            label: '工业',
            tag: 'warning'
        },
        speaking: {
            label: '药我说',
            tag: 'warning'
        },
        exam: {
            label: '考试',
            tag: 'success'
        },
        medicine_task: {
            label: '拿药练习',
            tag: 'danger'
        },
        practical_operation: {
            label: '实操课',
            tag: 'info'
        },
        practice: {
            label: '练习',
            tag: 'warning'
        },
        goods: {
            label: '单品',
            tag: 'success',
        },
        group: {
            label: '组合',
            tag: 'warning',
        },
        activity: {
            label: '打包',
            tag: 'danger',
        },
        teaching: {
            label: '带教',
            tag: 'warning'
        },
        live_course: {
            label: '直播课',
            tag: 'grey'
        },
        undefined: {
            label: '无',
            tag: ''
        }
    }
    return map[val][type]
})

export const stepType = Vue.filter('stepType', (val, type) => {
    let map = {
        0: {
            label: '发起申请',
            tag: 'info'
        },
        1: {
            label: '审核中',
            tag: 'warning'
        },
        2: {
            label: '已同意',
            tag: 'success'
        },
        3: {
            label: '已拒绝',
            tag: 'danger'
        }
    }
    return map[val][type]
})