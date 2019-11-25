/**
 * Created by huanghuixin on 2017/3/30.
 */
import * as api from './api'
import config from '../utils/config'
import authUtils from '../utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/company`

class CompanyService {
    // 获取工业连锁店
    // category - 0-企业 1-工业 2-连锁
    getIndrustrySelectList ({
        category = '',
        page_size = '',
        page = '',
        province = '',
        city = '',
        area = '',
        time_start = '',
        time_end = '',
        keyword = ''
    }) {
        let finalUrl = urlPre + '/search'
        return api.get(finalUrl, {
            category,
            page,
            page_size,
            province,
            city,
            area,
            time_start,
            time_end,
            keyword
        }, false).then((ret) => {
            return ret.data
        })
    }

    // 获取详情接口
    getCompanyInfo (val) {
        let finalUrl = `${urlPre}/${val}`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
}

export default new CompanyService()
