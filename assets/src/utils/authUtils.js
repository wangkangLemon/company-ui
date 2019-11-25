import store from '@/store'

/**
 * Created by huanghuixin on 2017/3/20.
 */

const KEY_AUTHTOKEN = 'KEY_AUTH_UTILS_TOKEN' // jwt的token
const KEY_AUTHUSERINFO = 'KEY_AUTH_UTILS_USERINFO' // 用户信息
const KEY_AUTHSETNAVMENU = 'KEY_AUTH_UTILS_SETNAVMENU' // 菜单
const KEY_AUTHOPERATION = 'KEY_AUTH_UTILS_AUTHOPERATION' // 权限代码
const KEY_TWICE_AUTH = 'KEY_AUTH_UTILS_TWICEAUTH' // 二次验证的key
const KEY_AUTHTOKEN_TTL = 3600 // jwt的token 有效期，过期作废，一个小时

import message from './message'
import authService from '../services/base/authService'
// import config from '../utils/config'

let refreshIntervalId
let firstRefreshTimeoutId
let authUtils = {
    // 身份凭证操作
    getAuthToken () {
        let str = localStorage.getItem(KEY_AUTHTOKEN)
        if (str == '') {
            return null
        }
        // try是为了兼容旧代码
        try {
            str = JSON.parse(str)
            if (str && str.ttl > Date.now()) {
                return str.token
            }
            // alert('检测到token过期')
            // debugger
            return null
        } catch (e) {
            return null
        }
    },
    setAuthToken (token) {
        localStorage.setItem(KEY_AUTHTOKEN, JSON.stringify({ token: token, ttl: Date.now() + KEY_AUTHTOKEN_TTL * 1000 }))
    },
    getUserInfo () {
        let str = localStorage.getItem(KEY_AUTHUSERINFO)
        if (str)
            return JSON.parse(str)
        else
            return null
    },
    setUserInfo (userInfo) {
        localStorage.setItem(KEY_AUTHUSERINFO, JSON.stringify(userInfo))
    },
    setAvatar (avatar) {
        var userInfo = this.getUserInfo()
        if (userInfo) {
            userInfo.avatar = avatar
            this.setUserInfo(userInfo)
        }
    },
    // 保存获取菜单
    getNavMenu () {
        let str = localStorage.getItem(KEY_AUTHSETNAVMENU)
        if (str)
            return JSON.parse(str)
        else
            return null
    },
    setNavMenu (navData) {
        localStorage.setItem(KEY_AUTHSETNAVMENU, JSON.stringify(navData))
    },
    // 保存获取权限代码
    getAuthOperation () {
        let str = localStorage.getItem(KEY_AUTHOPERATION)
        if (str)
            return JSON.parse(str)
        else
            return null
    },
    setAuthOperation (operations) {
        localStorage.setItem(KEY_AUTHOPERATION, JSON.stringify(operations))
    },
    // 设置获取二次绑定的key
    getTwiceToken () {
        return localStorage.getItem(KEY_TWICE_AUTH)
    },
    setTwiceToken (val) {
        return localStorage.setItem(KEY_TWICE_AUTH, val)
    },
    // 自动更新用户的token
    authRefreshtoken () {
        authUtils.clearAuthRefreshToken()
        firstRefreshTimeoutId = setTimeout(() => {
            authUtils.refreshToken()
        }, 1000 * 10)
        refreshIntervalId = setInterval(() => {
            authUtils.refreshToken()
        }, 1000 * 60 * 20) // 20分钟一请求
    },
    refreshToken () {
        let userinfo = authUtils.getUserInfo()
        if (userinfo && userinfo.id) {
            authService.refreshToken(userinfo.id).then((ret) => {
                authUtils.setAuthToken(ret.data.auth_token)
            })
        } else {
            if (xmrouter.history.current.name === 'login') {
                return
            }
            xmview.showTip('error', message.MESSAGE_AUTH_INVALID)
            // 记录当前的url
            xmrouter.push({ name: 'login', query: { returnUrl: window.location.href } })
        }
    },
    clearAuthRefreshToken () {
        refreshIntervalId && clearInterval(refreshIntervalId)
        firstRefreshTimeoutId && clearTimeout(firstRefreshTimeoutId)
    },
    clearAuthInfo () {
        authUtils.setAuthToken('')
        authUtils.setNavMenu('')
        authUtils.setUserInfo('')
    },
    isPermission (name) {
        if (authUtils.getUserInfo().roles.indexOf(201) >= 0) {
            return true
        }

        let operations = this.getAuthOperation()
        let ops = {}
        operations.map(item => {
            ops[item] = true
        })
        let map = ops
        return map[name]
    }
}

export default authUtils
