import authUtils from 'utils/authUtils'
import * as api from '../api'
import config from 'utils/config'
let company_id = authUtils.getUserInfo().company_id
const urlPre = `${config.apiHost}/com/${company_id}/exam`

class TestPagerService {
    search ({keyword, publish_status = -1, time_start = '', time_end = '', page, page_size}) {
        let url = `${urlPre}/search`
        return api.get(url, {keyword, publish_status, time_start, time_end, page, page_size}).then((ret) => {
            return ret.data
        })
    }

    getExamList ({
        keyword,
        page,
        page_size,
    }) {
        let url = `${urlPre}/search/name`
        return api.get(url, { keyword, page, page_size }).then(ret => {
            return ret.data
        })
    }

    create ({ name, description, image, single_score, multi_score, judge_score, score_pass, limit_repeat, limit_time, answer_show_type, answer_show_time, type, company_id, publish_type, study_score, publish_list, end_time, study_score_type, auto }) {
        let url = `${urlPre}`
        limit_time = limit_time === null ? '': limit_time
        answer_show_time = answer_show_time === null ? '': answer_show_time
        end_time = end_time === null ? '': end_time
        return api.post(url, JSON.stringify({ name, description, image, single_score, multi_score, judge_score, score_pass, limit_repeat, limit_time, answer_show_type, answer_show_time, type, company_id, publish_type, study_score, publish_list, end_time, study_score_type, auto })).then((ret) => {
            return ret.data
        })
    }

    update (examId, { name, description, image, single_score, multi_score, judge_score, score_pass, limit_repeat, limit_time, answer_show_type, answer_show_time, type, company_id, publish_type, study_score, publish_list, end_time, study_score_type, auto }) {
        let url = `${urlPre}/${examId}`
        limit_time = limit_time === null ? '': limit_time
        answer_show_time = answer_show_time === null ? '': answer_show_time
        end_time = end_time === null ? '': end_time
        return api.put(url, JSON.stringify({ name, description, image, single_score, multi_score, judge_score, score_pass, limit_repeat, limit_time, answer_show_type, answer_show_time, type, company_id, publish_type, study_score, publish_list, end_time, study_score_type, auto })).then((ret) => {
            return ret.data
        })
    }

    batchCreateQuestion (examId, questions) {
        let url = `${urlPre}/${examId}/subject`
        return api.post(url, JSON.stringify(questions)).then((ret) => {
            return ret.data
        })
    }

    delete (examId) {
        let url = `${urlPre}/${examId}`
        return api.del(url).then((ret) => {
            return ret.data
        })
    }

    /**
     * 批量删除
     * @param data
     */
    batchDelete (data) {
        let url = `${urlPre}/deletion`
        return api.put(url, JSON.stringify(data)).then((ret) => {
            return ret.data
        })
    }

    view (examId) {
        let url = `${urlPre}/${examId}`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }

    searchQuestion (examId, {type, tags, page, page_size}) {
        let url = `${urlPre}/${examId}/subject/search`
        return api.get(url, {type, tags, page, page_size}).then((ret) => {
            return ret.data
        })
    }

    online (examId) {
        let url = `${urlPre}/${examId}/disable`
        return api.put(url, JSON.stringify({status: 0})).then((ret) => {
            return ret.data
        })
    }

    timingOnline (examId, time) {
        let url = `${urlPre}/${examId}/disable`
        return api.put(url, JSON.stringify({status: 2, start_time: time})).then((ret) => {
            return ret.data
        })
    }

    offline (examId) {
        let url = `${urlPre}/${examId}/disable`
        return api.put(url, JSON.stringify({status: 1})).then((ret) => { 
            return ret.data
        })
    }
    // 获取添加编辑课程上传图片的url
    getUploadUrl ({image, alias}) {
        let url = `${urlPre}/image`
        return api.post(url, {image, alias}).then((ret) => {
            return ret.data
        })
    }

    getFileUploadUrl () {
        return `${urlPre}/subject/excel`
    }
    // 随机试卷试题创建
    createRandom (examId, {single_total, single_score, multi_total, multi_score, judge_total, judge_score, score_pass, subject_groups}) {
        let url = `${urlPre}/${examId}/auto`
        let data = {
            single_num: single_total,
            single_score: single_score,
            multi_num: multi_total,
            multi_score: multi_score,
            judge_num: judge_total,
            judge_score: judge_score,
            score_pass: score_pass,
            subject_groups: subject_groups
        }
        return api.put(url, JSON.stringify(data)).then((ret) => {
            return ret.data
        })
    }
}

export default new TestPagerService()
