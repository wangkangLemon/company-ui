import * as api from '../api'
import config from 'utils/config'
import authUtils from 'utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/medicine`

class MedicineService {
    // 品类销售名称查询列表
    searchCategory ({
        keyword,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/category/search`
        return api.get(finalUrl, { keyword, page, page_size }).then(ret => ret.data)
    }
    // 药品名称查询列表
    searchMedicine ({
        keyword,
        medicine_category_id,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { keyword, medicine_category_id, page, page_size }).then(ret => ret.data)
    }
}
export default new MedicineService()
