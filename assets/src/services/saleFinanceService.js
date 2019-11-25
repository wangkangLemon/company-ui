import * as api from '@/services/api'
import config from '@/utils/config'
import authUtils from '@/utils/authUtils'

let company_id = authUtils.getUserInfo().company_id
const urlPre = `${config.apiHost}/com/${company_id}/sale-finance`
/**
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2018/3/15
 * Time: 上午10:09
 */
class SaleFinanceService {

    /**
     * 获取推广返现列表
     * @param page
     * @param page_size
     */
    search ({page, page_size}) {
        let url = `${urlPre}/search`
        return api.get(url, {page, page_size}).then((ret) => {
            return ret.data
        })
    }

    /**
     * 获取总金额
     */
    amount () {
        let url = `${urlPre}/analytics`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }
}

export default new SaleFinanceService()