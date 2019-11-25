import * as api from '../api'
import config from 'utils/config'
import authUtils from 'utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/drug`

class DrugService {
    searchDrug ({
        common_name,
        category_group_id,
        category_drug_id,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { common_name, category_group_id, category_drug_id, page, page_size }).then(ret => ret.data)
    }
}
export default new DrugService()
