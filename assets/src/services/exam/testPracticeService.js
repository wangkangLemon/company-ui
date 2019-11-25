import authUtils from 'utils/authUtils'
import * as api from '../api'
import config from 'utils/config'
let company_id = authUtils.getUserInfo().company_id
const urlPre = `${config.apiHost}/com/${company_id}/exam/practice`

class TestPracticeService {
    // 搜索
    search ({keyword, status, time_start, time_end, page, page_size}) {
        let url = `${urlPre}/search`
        return api.get(url, {keyword, status, time_start, time_end, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 创建
    create ({ name, description, single_num, single_score, multi_num, multi_score, judge_num, judge_score, score_pass, limit_time, subject_group_id }) {
        let url = `${urlPre}`
        return api.post(url, { name, description, single_num, single_score, multi_num, multi_score, judge_num, judge_score, score_pass, limit_time, subject_group_id }, false, true).then((ret) => {
            return ret.data
        })
    }
    // 更新
    update (id, { name, description, single_num, single_score, multi_num, multi_score, judge_num, judge_score, score_pass, limit_time, subject_group_id }) {
        let url = `${urlPre}/${id}`
        return api.put(url, { name, description, single_num, single_score, multi_num, multi_score, judge_num, judge_score, score_pass, limit_time, subject_group_id }, false, true).then((ret) => {
            return ret.data
        })
    }
    // 详情
    view (id) {
        let url = `${urlPre}/${id}`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }
    // 上线
    online (id) {
        let url = `${urlPre}/${id}/online`
        return api.put(url, {}).then((ret) => {
            return ret.data
        })
    }
    // 下线
    offline (id) {
        let url = `${urlPre}/${id}/offline`
        return api.put(url, {}).then((ret) => {
            return ret.data
        })
    }
    // 删除
    delete (id) {
        let url = `${urlPre}/${id}`
        return api.del(url, {}).then((ret) => {
            return ret.data
        })
    }
    // 批量删除
    batchDelete (data) {
        let url = `${urlPre}/deletion`
        return api.put(url, data, false, true).then((ret) => {
            return ret.data
        })
    }
}

export default new TestPracticeService()
