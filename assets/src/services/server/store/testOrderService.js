import authUtils from 'utils/authUtils'
import * as api from '../../api'
import config from 'utils/config'
let company_id = authUtils.getUserInfo().company_id
const urlPre = `${config.apiHost}/com/${company_id}/score/store/order`

class TestOrderService {
    search ({status, mobile, order_no, user_name, staff_id, product_name, time_start, time_end, page, page_size}) {
        let url = `${urlPre}/search`
        if (status === '' || status === undefined) status = -1
        return api.get(url, {company_id, status, mobile, order_no, user_name, staff_id, product_name, time_start, time_end, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 添加备注
    remarks ({order_id, remarks}) {
        let url = `${urlPre}/remarks`
        return api.post(url, JSON.stringify({company_id, order_id, remarks})).then((ret) => {
            return ret.data
        })
    }
    deliverGoods ({order_id}) {
        let url = `${urlPre}/send`
        return api.post(url, JSON.stringify({order_id})).then((ret) => {
            return ret.data
        })
    }

}

export default new TestOrderService()
