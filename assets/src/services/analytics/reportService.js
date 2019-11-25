import * as api from '../api'
import config from 'utils/config'
import authUtils from 'utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/report`

class ReportService {
    // 连锁开启APP及使用率查询
    searchAppReport ({
        is_export,
        time_start,
        time_end,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/app/usage/search`
        return api.get(finalUrl, { is_export, time_start, time_end, page, page_size }).then(ret => {
            return is_export ? ret : ret.data
        })
    }

    // APP使用用户与未使用用户
    searchAppUser ({
        is_used,
        is_export,
        name,
        staff_id,
        mobile,
        create_date,
        department_id,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/app/usage/user`
        return api.get(finalUrl, { is_used, is_export, name, staff_id, mobile, create_date, department_id, page, page_size }).then(ret => {
            return is_export ? ret : ret.data
        })
    }

    // 课程任务完成比率报表
    searchCourseReport ({
        is_export,
        task_name,
        time_start,
        time_end,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/task/finished/search`
        return api.get(finalUrl, { is_export, task_name, time_start, time_end, page, page_size }).then(ret => {
            return is_export ? ret : ret.data
        })
    }

    // 课程任务完成排名报表
    searchCourse ({
        task_id,
        sort_type,
        is_export,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/task/finished/${task_id}`
        return api.get(finalUrl, { sort_type, is_export, page, page_size }).then(ret => {
            return is_export ? ret : ret.data
        })
    }

    // 考试成绩与通过率报表
    searchExamReport ({
        is_export,
        exam_name,
        time_start,
        time_end,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/exam/search`
        return api.get(finalUrl, { is_export, exam_name, time_start, time_end, page, page_size }).then(ret => {
            return is_export ? ret : ret.data
        })
    }

    // 考试成绩排名
    searchExam ({
        exam_id,
        is_export,
        name,
        staff_id,
        department_id,
        score_grade,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/exam/${exam_id}`
        return api.get(finalUrl, { is_export, name, staff_id, department_id, score_grade, page, page_size }).then(ret => {
            return is_export ? ret : ret.data
        })
    }

    // 连锁学习情况统计报表
    searchStudy ({
        is_export,
        time_start,
        time_end,
        course_id,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/learn/search`
        return api.get(finalUrl, { is_export, time_start, time_end, course_id, page, page_size }).then(ret => {
            return is_export ? ret : ret.data
        })
    }

    // 课程学习情况统计
    searchExamUser ({
        is_export,
        time_start,
        time_end,
        name,
        staff_id,
        course_id,
        department_id,
        progress,
        mobile,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/learn/${course_id}`
        return api.get(finalUrl, { is_export, time_start, time_end, name, staff_id, department_id, progress, mobile, page, page_size }).then(ret => {
            return is_export ? ret : ret.data
        })
    }

    // 连锁练习错题统计报表
    searchPracticeReport ({
        is_export,
        type,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/store/practice/search`
        return api.get(finalUrl, { is_export, type, page, page_size }).then(ret => {
            return is_export ? ret : ret.data
        })
    }

    // 连锁模拟考试概况统计报表
    searchSimulation ({
        is_export,
        exam_id,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/store/simulation/search`
        return api.get(finalUrl, { is_export, exam_id, page, page_size }).then(ret => {
            return is_export ? ret : ret.data
        })
    }

    // 店员学习情况统计报表
    searchStaff ({
        name,
        department_id,
        is_export,
        time_start,
        time_end,
        sort_type,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/learn/user/search`
        return api.get(finalUrl, { name, department_id, is_export, time_start, time_end, sort_type, page, page_size }).then(ret => {
            return is_export ? ret : ret.data
        })
    }

    // 店员学习每门课程的详情
    searchStaffDetail ({
        user_id,
        course_name,
        progress,
        is_export,
        time_start,
        time_end,
        page,
        page_size,
    }) {
        let finalUrl = `${urlPre}/learn/user/search/${user_id}`
        return api.get(finalUrl, { course_name, progress, is_export, time_start, time_end, page, page_size }).then(ret => {
            return is_export ? ret : ret.data
        })
    }

    viewGsp (exam_id) {
        let finalUrl = `${urlPre}/exam/gsp/${exam_id}`
        return api.post(finalUrl).then(ret => ret.data)
    }

    downloadGsp (exam_id) {
        let finalUrl = `${urlPre}/exam/gsp/export/${exam_id}`
        return api.post(finalUrl).then(ret => ret.data)
    }

    gzipGsp (id) {
        let finalUrl = `${urlPre}/exam/gsp`
        return api.post(finalUrl, {id}).then(ret => ret)
    }
}
export default new ReportService()
