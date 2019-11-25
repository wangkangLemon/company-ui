// 主页
import * as api from '../api'
import config from '../../utils/config'
import authUtils from '../../utils/authUtils'
const urlPre = `${config.apiHost}/com/${authUtils.getUserInfo().company_id}/dashboard`

class MainService {
    // 主页接口
    getMain () {
        let url = `${urlPre}`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }

    getChart (range = 'month') {
        let url = `${urlPre}/chart`
        return api.get(url, { range }).then((ret) => {
            return ret.data
        })
    }

    getList () {
        let url = `${urlPre}/list`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }

    getLearnBang ({page, page_size, category, is_export}) {
        let url = `${urlPre}/learntotal`
        return api.get(url, { page, page_size, category, is_export }).then((ret) => {
            return ret
        })
    }

    getActiveBang ({page, page_size, category, is_export}) {
        let url = `${urlPre}/actdeptotal`
        return api.get(url, { page, page_size, category, is_export }).then((ret) => {
            return ret
        })
    }

    getCourseBang ({page, page_size, category, is_export}) {
        let url = `${urlPre}/coursetotal`
        return api.get(url, { page, page_size, category, is_export }).then((ret) => {
            return ret
        })
    }

}
export default new MainService()
