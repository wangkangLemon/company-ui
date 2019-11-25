import * as api from '../api'
import config from 'utils/config'
import authUtils from 'utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/score`

class ScoreService {
    getList ({
        user_id,
        staff_id,
        department_id,
        time_start,
        time_end,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { user_id, staff_id, department_id, time_start, time_end, page, page_size }).then(ret => {
            return ret.data
        })
    }
    // 学分记录-导出
    export ({
        user_id,
        staff_id,
        department_id,
        time_start,
        time_end,
        page,
        page_size
    }) {
        let url = `${urlPre}/export`
        return api.post(url, api.processJSONParams({ user_id, staff_id, department_id, time_start, time_end, page, page_size })).then((ret) => {
            return ret.data
        })
    }

    getView ({
        user_id,
        time_start,
        time_end,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/${user_id}/view`
        return api.get(finalUrl, { time_start, time_end, page, page_size }).then(ret => {
            return ret.data
        })
    }
}
export default new ScoreService()
