import * as api from '../api'
import config from 'utils/config'
import authUtils from 'utils/authUtils'
let company_id = authUtils.getUserInfo().company_id
const urlPre = config.apiHost + `/com/${company_id}/customer`

class CustomService {
    // 会员信息画板
    getCustomerDashboard ({
        department_id,
        start_date,
        end_date,
    }) {
        let finalUrl = `${urlPre}/dashboard`
        return api.get(finalUrl, { department_id, start_date, end_date }).then(ret => ret.data)
    }
    // 会员列表检索
    searchCustomer ({
        last_cost_department_id,
        name,
        mobile,
        vip_num,
        customer_tag_id,
        arrive_start_time,
        arrive_end_time,
        regist_start_time,
        regist_end_time,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { last_cost_department_id, name, mobile, vip_num, customer_tag_id, last_arrived_start: arrive_start_time, last_arrived_end: arrive_end_time, created_time_start: regist_start_time, created_time_end: regist_end_time, page, page_size }).then(ret => ret.data)
    }
    // 会员标签列表检索
    searchTag ({
        name,
        create_start_time,
        create_end_time,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/tag/search`
        return api.get(finalUrl, { name, create_start_time, create_end_time, page, page_size }).then(ret => ret.data)
    }
    // 创建标签
    createTag (name) {
        let finalUrl = `${urlPre}/tag`
        return api.post(finalUrl, { name }, false, true).then(ret => {
            xmview.showTip('success', ret.message || '创建标签成功')
        })
    }
    // 删除标签
    deleteTag (tag_id) {
        let finalUrl = `${urlPre}/tag/${tag_id}`
        return api.del(finalUrl).then(ret => {
            xmview.showTip('success', ret.message || '删除标签成功')
        })
    }
    // 导出会员
    exportFile (ids) {
        let finalUrl = `${urlPre}/export`
        return api.post(finalUrl, { ids }, false, true).then(ret => {
        })
    }
}
export default new CustomService()
