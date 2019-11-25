import * as api from '../api'
import config from 'utils/config'
import authUtils from 'utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/flowing`

class FlowingService {
    // 客流画板
    getFlowingDashboard ({
        department_id,
        start_date,
        end_date,
    }) {
        let finalUrl = `${urlPre}/dashboard`
        return api.get(finalUrl, { department_id, start_date, end_date }).then(ret => ret.data)
    }
    // 进店人群检索
    searchFlowing ({
        name,
        vip_num,
        mobile,
        last_arrive_department_id,
        is_new,
        arrive_start_time,
        arrive_end_time,
        page,
        page_size,
    }) {
        let finalUrl = `${urlPre}/crowd/search`
        return api.get(finalUrl, { last_arrive_department_id, name, vip_num, mobile, is_new, arrive_start_time, arrive_end_time, page, page_size }).then(ret => {
            return ret.data
        })
    }
    // 进店详情
    getFlowingDetail (customer_crowd_id) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { customer_crowd_id }).then(ret => ret.data)
    }
    // 忽略列表
    searchDenied ({
        start_time,
        end_time,
        department_id,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/deny/search`
        return api.get(finalUrl, { start_time, end_time, department_id, page, page_size }).then(ret => ret.data)
    }
    // 激活已忽略人群
    activate (face_id) {
        let finalUrl = `${urlPre}/deny/${face_id}/activate`
        return api.put(finalUrl).then(ret => {
            xmview.showTip('success', ret.message || '激活成功')
        })
    }
    // 进店购药详情
    getDrugList ({
        customer_crowd_id
    }) {
        let finalUrl = `${urlPre}/order/search`
        return api.get(finalUrl, { customer_crowd_id }).then(ret => ret.data)
    }
}
export default new FlowingService()
