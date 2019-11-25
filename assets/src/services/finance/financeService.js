import * as api from '../api'
import config from 'utils/config'
import authUtils from 'utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/finance`

class FinanceService {
    // 搜索培训账单
    searchBill ({
        stat_month,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/bill/training`
        return api.get(finalUrl, { stat_month, page, page_size }).then(ret => ret.data)
    }
    // 导出培训账单
    exportBill ({
        is_export = 1,
        stat_month,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/bill/training`
        return api.get(finalUrl, { is_export, stat_month, page, page_size }).then(ret => {
            if (ret.code) {
                Promise.reject(ret)
            }
            return ret
        })
    }
    // 搜索财务流水
    searchFinance ({
        category,
        time_start,
        time_end,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { category, time_start, time_end, page, page_size }).then(ret => ret.data)
    }
    // 财务信息-概要
    getFinanceInfo () {
        let finalUrl = `${urlPre}/info`
        return api.get(finalUrl).then(ret => ret.data)
    }
    export ({
        is_export = 1,
        category,
        time_start,
        time_end,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { is_export, category, time_start, time_end, page, page_size }).then(ret => {
            if (ret.code) {
                Promise.reject(ret)
            }
            return ret
        })
    }

    toRecharge({money}) {
        let finalUrl = `${config.apiHost}/finance/recharge`
        return api.post(finalUrl, JSON.stringify({ money })).then(ret => ret.data)
    }
}
export default new FinanceService()
