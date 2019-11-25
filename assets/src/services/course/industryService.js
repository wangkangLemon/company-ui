import * as api from 'services/api'
import authUtils from 'utils/authUtils'
import config from 'utils/config'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/newcourse`

class IndustryService {
    //  获取可参与课程
    getTakeCourseList ({
        industry_id,
        course_id,
        page = 1,
        page_size = 15
    }) {
        let finalUrl = `${urlPre}/industry/search`
        return api.get(finalUrl, { industry_id, course_id, page, page_size }).then((ret) => {
            return ret.data
        })
    }
    // 获取已屏蔽课程
    getDeniedCourseList ({
        industry_id,
        course_id,
        page = 1,
        page_size = 15
    }) {
        let finalUrl = `${urlPre}/industry/deny/course/search`
        return api.get(finalUrl, { industry_id, course_id, page, page_size }).then(ret => {
            return ret.data
        })
    }
    // 获取已屏蔽工业
    getDeniedIndustryList ({
        page = 1,
        page_size = 15
    }) {
        let finalUrl = `${urlPre}/industry/deny/industry/search`
        return api.get(finalUrl, { page, page_size }).then(ret => {
            return ret.data
        })
    }
    // 投放门店
    getDepartment ({
        course_id,
        department_id,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/industry/department`
        return api.get(finalUrl, { course_id, department_id, page, page_size }).then(ret => {
            return ret.data
        })
    }

    // department_id为0屏蔽所有门店课程
    denyCourse ({
        course_id,
        department_id = 0,
        industry_id,
        reason,
    }) {
        let finalUrl = `${urlPre}/industry/${course_id}/deny/course`
        return api.post(finalUrl, { course_id, department_id, industry_id, reason }).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 屏蔽工业
    denyIndustry ({
        industry_id,
        reason
    }) {
        let finalUrl = `${urlPre}/industry/deny/industry/${industry_id}`
        return api.post(finalUrl, { reason }).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    /**
     * 取消屏蔽课程
     */
    cancelDeniedCourse ({
        course_id,
        department_id
    }) {
        let finalUrl = `${urlPre}/industry/deny/course/${course_id}/cancel`
        return api.post(finalUrl, {department_id}).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    cancelDeniedIndustry ({
        industry_id
    }) {
        let finalUrl = `${urlPre}/industry/deny/industry/${industry_id}/cancel`
        return api.post(finalUrl).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    /**
     * 屏蔽原因
     */
    getDeniedCourseReason ({
        course_id,
        department_id
    }) {
        let finalUrl = `${urlPre}/industry/deny/course/${course_id}`
        return api.get(finalUrl, {department_id}).then(ret => {
            return ret.data
        })
    }

    getDeniedIndustryReason ({
        industry_id
    }) {
        let finalUrl = `${urlPre}/industry/deny/industry/${industry_id}`
        return api.get(finalUrl).then(ret => {
            return ret.data
        })
    }

}
export default new IndustryService()
