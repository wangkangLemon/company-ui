import * as api from '../api'
import config from 'utils/config'

const urlPre = config.apiHost + '/mine'
class MineService {
    getProfile () {
        let url = `${urlPre}/profile`
        return api.get(url).then(ret => {
            return ret.data.data
        })
    }

    // =========================二次登陆部分============
    getSafeSetInfo () {
        let url = `${urlPre}/two-step`
        return api.get(url).then(ret => {
            return ret.data
        })
    }

    // 二次登陆绑定的微信登录参数
    getWechatLoginConfig () {
        let url = `${urlPre}/two-step/wechat`
        return api.get(url).then(ret => {
            return ret.data.wechatConfig
        })
    }

    // 绑定邮箱或者手机
    bindOrChangeTwo ({type, code, receiver}) {
        let url = `${urlPre}/two-step/code/bind`
        return api.put(url, {type, code, receiver}).then((ret) => {
            return ret.data.adminTwoStepAuthToken
        })
    }

    // 短信和邮箱验证码
    sendTwoValidCode ({type, receiver}) {
        let url = `${urlPre}/two-step/code/send`
        return api.post(url, {type, receiver})
    }

    // 校验验证码
    validTwoVliadCode ({code, type}) {
        let url = `${urlPre}/two-step/code/verify`
        return api.post(url, {code, type}).then((ret) => {
            return ret.data.adminTwoStepAuthToken
        })
    }

    // 修改个人信息
    updateProfile ({name, address, sex}) {
        let url = `${urlPre}/profile`
        return api.put(url, {name, address, sex})
    }

    // 上传头像
    uploadAvatar ({avatar, alias}) {
        let url = `${urlPre}/profile/avatar`
        return api.post(url, {avatar, alias}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 获取公司信息接口
    getCompanyInfo () {
        let url = `${urlPre}/company`
        return api.get(url).then((ret) => {
            return ret.data.data
        })
    }

    modifyCompany ({name, concact, mobile, email, tel, fax, province, city, area, address, zip, url, description}) {
        let finalUrl = `${urlPre}/company`
        return api.put(finalUrl, {
            name,
            concact,
            mobile,
            email,
            tel,
            fax,
            province,
            city,
            area,
            address,
            zip,
            url,
            description
        }).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 获取密码接口
    getPassword () {
        let url = `${urlPre}/password`
        return api.get(url).then((ret) => {
            return ret.data.data
        })
    }

    // 修改密码
    modifyPassword ({origin_password, new_password, re_password}) {
        let url = `${urlPre}/password`
        return api.put(url, {origin_password, new_password, re_password}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
}

export default new MineService()
