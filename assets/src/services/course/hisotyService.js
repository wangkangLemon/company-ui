/**
 * Created by huanghuixin on 2017/4/1.
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
    getHistory ({page, page_size, course_id, company_id, department_id, time_start, time_end, testing, grade, user_id, course_type, role_type, group_id, exam_id}) {
        let finalUrl = urlPre + '/history/search'
        return api.get(finalUrl, {
            page,
            page_size,
            course_id,
            company_id, // 连锁
            department_id,
            time_start,
            time_end,
            role_type,
            testing, // 不赋值则为未选择，1为已考试
            grade, // 不赋值则为未选择，1位满分，2为及格，3为不及格
            user_id, // 用户昵称
            group_id, // 用户组id
            course_type, // 课程类型  public表示公开课，private为内训，industry为工业课程
            exam_id,
        }).then((ret) => {
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
        return api.post(url, {name})
    }

    exportHistory ({ course_type, course_id, time_start, time_end, department_id, user_id, grade, group_id, role_type, exam_id }) {
        let url = `${urlPre}/export`
        return api.post(url, JSON.stringify({ course_type, course_id, time_start, time_end, department_id, user_id, grade, group_id, role_type, exam_id })).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    getTestingDetail (id) {
        let url = `${urlPre}/${id}`
        return api.get(url).then(ret => {
            return ret.data
        })
    }
}
export default new TestingService()
