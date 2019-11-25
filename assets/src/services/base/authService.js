import * as api from '../api'
import config from '../../utils/config'
import authUtils from '../../utils/authUtils'
const urlPre = config.apiHost + '/auth'

class AuthService {
    // 登录
    login ({ username, password, seccode }) {
        let url = urlPre + '/login'
        return api.post(url, { username, password, seccode }, true).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)

            }
        })
    }

    // 发送验证码
    sendCode (mobile) {
        let url = `${urlPre}/seccode`
        return api.post(url, { mobile }, false).then((ret) => {
            return ret.data
        })
    }

    // 刷新token
    refreshToken (userid) {
        let url = urlPre + '/refresh'
        return api.get(url, { id: userid }).catch((e) => {
            e.tipCom && e.tipCom.close()
        })
    }

    // 登出
    loginout () {
        authUtils.setAuthToken(null)
    }

    // 切换角色
    switchRole (role_id, agent_id = '', product_id = '') {
        let url = `${urlPre}/switch`
        return api.post(url, { role_id, agent_id, product_id }).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }
}

export default new AuthService()
