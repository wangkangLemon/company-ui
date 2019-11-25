import authUtils from 'utils/authUtils'
import * as api from '../api'
import config from 'utils/config'
let company_id = authUtils.getUserInfo().company_id
const urlPre = `${config.apiHost}/com/${company_id}/exam/practice/stat`

class TestPracticeStatService {
    // 模拟考试统计
    search ({keyword, page, page_size}) {
        let url = `${urlPre}/search`
        return api.get(url, {keyword, page, page_size}).then((ret) => {
            return ret.data
        })
    }

    // 模拟考试统计-导出
    export ({keyword}) {
        let url = `${urlPre}/export`
        return api.post(url, api.processJSONParams({keyword})).then((ret) => {
            return ret.data
        })
    }

    // 模拟考试统计-门店
    searchDepartment ({practice_id, department_id, page, page_size}) {
        let url = `${urlPre}/department`
        return api.get(url, {practice_id, department_id, page, page_size}).then((ret) => {
            return ret.data
        })
    }

    // 模拟考试统计-门店-导出
    exportDepartment ({practice_id, department_id}) {
        let url = `${urlPre}/department/export`
        return api.post(url, api.processJSONParams({practice_id, department_id})).then((ret) => {
            return ret.data
        })
    }

    // 模拟考试统计-店员
    searchUser ({practice_id, department_id, user_name, user_staff_id, page, page_size}) {
        let url = `${urlPre}/user`
        return api.get(url, {practice_id, department_id, user_name, user_staff_id, page, page_size}).then((ret) => {
            return ret.data
        })
    }

    // 模拟考试统计-店员-导出
    exportUser ({practice_id, department_id, user_name, user_staff_id}) {
        let url = `${urlPre}/user/export`
        return api.post(url, api.processJSONParams({practice_id, department_id, user_name, user_staff_id})).then((ret) => {
            return ret.data
        })
    }

    // 练习错题统计
    searchSubject ({keyword, type, subject_group_id, page, page_size}) {
        let url = `${urlPre}/subject`
        type = (!type && type !== 0) ? -1 : type
        return api.get(url, {keyword, type, subject_group_id, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 练习错题统计导出
    exportSubject ({keyword, type, subject_group_id}) {
        let url = `${urlPre}/subject/export`
        type = (!type && type !== 0) ? -1 : type
        return api.post(url, api.processJSONParams({keyword, type, subject_group_id})).then((ret) => {
            return ret.data
        })
    }
}

export default new TestPracticeStatService()
