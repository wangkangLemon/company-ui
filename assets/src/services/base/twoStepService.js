import * as api from '../api'
import config from '../../utils/config'

const urlPre = config.apiHost + '/two-step'

class TwoStepService {
    // 获取校验信息
    getSafeSetInfo () {
        let url = `${urlPre}`
        return api.get(url).then(ret => {
            return ret.data
        })
    }

    // 发送邮箱验证码
    sendEmailValidcode () {
        let url = `${urlPre}/email/send`
        return api.post(url)
    }

    // 发送短信验证码
    sendSmsValidcode () {
        let url = `${urlPre}/sms/send`
        return api.post(url)
    }

    // 短信二次验证
    twiceSmsValid ({ code }) {
        let url = `${urlPre}/sms/verify`
        return api.post(url, { code }).then((ret) => {
            return ret.data.userTwoStepAuthToken
        })
    }

    // 邮箱二次验证
    twiceEmailValid ({ code }) {
        let url = `${urlPre}/email/verify`
        return api.post(url, { code }).then((ret) => {
            return ret.data.userTwoStepAuthToken
        })
    }
}

export default new TwoStepService()
