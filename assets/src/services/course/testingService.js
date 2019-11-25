/**
 *  学习汇总
 */
import * as api from '../api'
import config from '../../utils/config'
import authUtils from '../../utils/authUtils'

const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/testing`

class TestingService {
    // 获取管理员列表
    getAmount () {
        let url = urlPre
        return api.get(url).then(ret => {
            return ret.data.analytics
        })
    }

    // 获取考试记录
    getHistory ({ page, page_size, course_id, company_id, department_id, account, time_start, time_end, grade, user_id, role_type, type, testing, finished, group_id, exam_id }) {
        let finalUrl = urlPre + '/highest/search'
        return api.get(finalUrl, {
            page,
            page_size,
            course_id,
            company_id, // 连锁
            department_id,
            account,
            time_start,
            time_end,
            grade, // 不赋值则为未选择，1位满分，2为及格，3为不及格
            user_id, // 用户昵称
            type, // 课程类型  public表示公开课，private为内训，industry为工业课程
            role_type, // 角色
            testing,  // 考试完成情况
            finished,
            group_id,
            exam_id,
        }).then((ret) => {
            return ret.data
        })
    }
    getUnlearnedList ({
        name = '',
        mobile,
        department_id,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/history/unlearned`
        return api.get(finalUrl, { name, mobile, department_id, page, page_size }).then(ret => {
            return ret.data
        })
    }
    // 获取考试分析列表
    getTestingList ({date, page, page_size}) {
        let finalUrl = urlPre + '/search'
        return api.get(finalUrl, {date, page, page_size}).then((ret) => {
            return ret.data
        })
    }

    // 导出考试记录
    exportTesting (reqObj) {
        let finalUrl = urlPre + '/history/search'
        api.downLoad(finalUrl, Object.assign(reqObj, {export: 1}), '考试记录.xls')
    }

    // 异步导出考试记录
    exportTestingHistoryAsync ({name = '全部_考试记录'} = {}) {
        let companyid = authUtils.getUserInfo().company_id
        let url = `${config.apiHost}/com/${companyid}/export/testing`
        return api.post(url, {name}).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    exportHighest ({ type, course_id, time_start, time_end, department_id, user_id, grade, group_id, role_type, finished, exam_id }) {
        let url = `${urlPre}/highest/export`
        return api.post(url, JSON.stringify({ type, course_id, time_start, time_end, department_id, user_id, grade, group_id, role_type, finished, exam_id })).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    viewGsp (id) {
        let url = `${urlPre}/gsp/${id}`
        return api.get(url).then(ret => {
            return ret.data
        }).catch(ret => Promise.reject())
    }

    downloadGsp (id) {
        let url = `${urlPre}/gsp/export/${id}`
        return api.post(url).then(ret => {
            return ret.data
        }).catch(ret => Promise.reject())
    }

    batchExportGsp (ids) {
        let url = `${urlPre}/gsp`
        return api.post(url, {id: ids.join(',')}).then(ret => {
            return ret
        })
    }
}
export default new TestingService()
