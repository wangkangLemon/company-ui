import authUtils from 'utils/authUtils'
import * as api from '../api'
import config from 'utils/config'
let company_id = authUtils.getUserInfo().company_id
const urlPre = `${config.apiHost}/com/${company_id}/newcourse/order`

class OrderService {
    // 搜索
    search ({ course_id, user_id, user_mobile, pay_method, status, in_company, time_start, time_end, page, page_size }) {
        let url = urlPre + '/search'
        return api.get(url, { course_id, user_id, user_mobile, pay_method, status, in_company, time_start, time_end, page, page_size }, false).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }

    // 更新备注
    updateNote ({id, note}) {
        let url = `${urlPre}/${id}/note`
        return api.put(url, {note}).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
}

export default new OrderService()
