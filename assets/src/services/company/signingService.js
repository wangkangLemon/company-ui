// 门店
import authUtils from '../../utils/authUtils'
import * as api from '../api'
import config from '../../utils/config'
const urlPre = `${config.apiHost}/signing`

class SigningService {
    // 获取续签价格
    getsigningPriceinfo ({type}) {
        let finalUrl = `${urlPre}/priceinfo`
        return api.get(finalUrl,{type}).then((ret) => {
            if (ret.code == 0) {
                return ret.data.price_info
            } else {
                return Promise.reject(ret)

            }
        })
    }

    // 企业服务到期时间
    getsigningExpireDate () {
        let finalUrl = `${urlPre}`
        return api.get(finalUrl).then((ret) => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)

            }
        })
    }
    
    // 增加门店
    addDepartment ({ department_count }) {
        let finalUrl = `${urlPre}/add`
        return api.post(finalUrl, JSON.stringify({department_count})).then((ret) => {
            if (ret.code == 0) {
                return ret.data.signing
            } else {
                return Promise.reject(ret)

            }
        })
    }

    // 续签门店
    expireDepartment ({ department_count,duration_year=1 }) {
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, JSON.stringify({department_count, duration_year})).then((ret) => {
            if (ret.code == 0) {
                return ret.data.signing
            } else {
                return Promise.reject(ret)

            }
        })
    }

    // 网签门店数量检查
    departmentAddCheck () {
        let finalUrl = `${urlPre}/department/checked`
        return api.get(finalUrl).then((ret) => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)

            }
        })
    }
    
}
export default new SigningService()
