/**
 * Created by huangrui on 2017/4/7.
 */
import * as api from './api'
import config from '../utils/config'
import authUtils from '../utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/department`

class DepartmentService {
    // 获取门店列表
    getDepartment ({
        page = '',
        page_size = '',
        company_id = '',
        province = '',
        city = '',
        area = '',
        keyword = '',
        concact = '',
        time_start = '',
        time_end = '' }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { page, page_size, company_id, province, city, area, keyword, concact, time_start, time_end }, false).then((ret) => {
            return ret.data
        })
    }

    getDepartmentByName ({
        page = '',
        page_size = '',
        isdep = 1,
        keyword = '',
    }) {
        let finalUrl = `${urlPre}/search/name`
        return api.get(finalUrl, { page, page_size, keyword, isdep }, false).then((ret) => {
            return ret.data
        })
    }
}
export default new DepartmentService()
