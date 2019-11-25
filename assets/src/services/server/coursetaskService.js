// 课程任务
import authUtils from '../../utils/authUtils'
import * as api from '../api'
import config from '../../utils/config'

let company_id = authUtils.getUserInfo().company_id
const urlPre = `${config.apiHost}/com/${company_id}/course/task`

class CourseTaskService {
    // 获取任务统计列表
    courseTaskStatSearch ({type, keyword, page, page_size}) {
        let finalUrl = `${urlPre}/stat/search`
        return api.get(finalUrl, {type, keyword, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 获取任务用户统计列表
    courseTaskUserStateSearch ({id, status, department_id, role_type, keyword, page, page_size}) {
        let finalUrl = `${urlPre}/stat/${id}/user/search`
        return api.get(finalUrl, {status, department_id, role_type, keyword, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    courseTaskStateSearch ({id}) {
        let finalUrl = `${urlPre}/stat/${id}/user`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
    // 获取任务管理列表
    getTaskSearch ({keyword, type, status, page, page_size}) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, {keyword, type, status, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 获取任务模板列表
    getCourseTaskTemplateSearch ({category_id, keyword, page, page_size}) {
        let finalUrl = `${urlPre}/template/search`
        return api.get(finalUrl, {category_id, keyword, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    getCourseTaskTemplate ({id}) {
        let finalUrl = `${urlPre}/template/${id}`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
    // 删除课程任务
    deleteCourseTask ({id}) {
        let finalUrl = `${urlPre}/${id}/delete`
        return api.del(finalUrl)
    }
    // 课程任务下线
    revokeCourseTask ({id}) {
        let finalUrl = `${urlPre}/${id}/revoke`
        return api.post(finalUrl)
    }
    // 课程任务上线
    publishCourseTask ({id}) {
        let finalUrl = `${urlPre}/${id}/publish`
        return api.post(finalUrl)
    }
    // 课程任务定时上线
    timingPublish ({id, start_time}) {
        let finalUrl = `${urlPre}/${id}/timingpublish`
        return api.post(finalUrl, {id: id, start_time: start_time})
    }
    // 课程任务上传封面
    uploadCover ({image, alias}) {
        let finalUrl = `${urlPre}/cover`
        return api.post(finalUrl, {image, alias}).then((ret) => {
            return ret.data
        })
    }
    //
    courseTaskDetail ({id}) {
        let finalUrl = `${urlPre}/${id}`
        return api.get(finalUrl).then(ret => {
            return ret.data
        })
    }
    // 获取课程任务详细信息
    // courseTaskDetail ({id}) {
    //     let finalUrl = `${urlPre}/template/${id}`
    //     return api.get(finalUrl).then((ret) => {
    //         return ret.data
    //     })
    // }
    courseTaskTree () {
        let finalUrl = `${urlPre}/template/category/tree`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
    exportTask ({
        type,
        keyword
    }) {
        let finalUrl = `${urlPre}/stat/export`
        return api.get(finalUrl, { type, keyword }).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
            return ret
        })
    }

    exportUserTask ({
        id,
        status,
        department_id,
        role_type,
        keyword,
    }) {
        let finalUrl = `${urlPre}/stat/${id}/user/export`
        return api.get(finalUrl, { status, department_id, role_type, keyword }).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
            return ret
        })
    }

    submitTask (taskData) {
        taskData.object = JSON.stringify(taskData.object)
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, taskData).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    editTask (taskData, task_id) {
        taskData.object = JSON.stringify(taskData.object)
        let finalUrl = `${urlPre}/${task_id}`
        return api.put(finalUrl, taskData).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 获取冻结资金，由于和创建编辑时候的参数结构一致，会有结构体，故用post请求数据
    getFrozenInfo (id) {
        let finalUrl = `${urlPre}/${id}/frozen/info`
        return api.get(finalUrl).then(ret => ret.data)
    }

    // 门店学习任务统计
    reportDepartmentTask ({
        is_export = 0,
        department_id = '',
        department_name = '',
        time_start = '',
        time_end = '',
        page,
        page_size,
    }) {
        let finalUrl = `${urlPre}/report/department/task`
        return api.get(finalUrl, {
            is_export,
            department_id,
            department_name,
            time_start,
            time_end,
            page,
            page_size,
        }).then(ret => ret.data)
    }

    // 店员学习任务统计
    reportStaffTask ({
        is_export = 0,
        user_name = '',
        task_name = '',
        department_id = '',
        department_name = '',
        time_start = '',
        time_end = '',
        page,
        page_size,
    }) {
        let finalUrl = `${urlPre}/report/staff/task`
        if (task_name) {
            task_name = encodeURIComponent(task_name)
        }
        return api.get(finalUrl, {
            is_export,
            user_name,
            task_name,
            department_id,
            department_name,
            time_start,
            time_end,
            page,
            page_size,
        }).then(ret => ret.data)
    }

    // 店员学习任务详情
    reportStaffTaskDetail ({
        is_export = 0,
        user_name = '',
        task_name = '',
        department_id = '',
        department_name = '',
        time_start = '',
        time_end = '',
        page,
        page_size,
    }) {
        let finalUrl = `${urlPre}/report/staff/detail`
        if (task_name) {
            task_name = encodeURIComponent(task_name)
        }
        return api.get(finalUrl, {
            is_export,
            user_name,
            task_name,
            department_id,
            department_name,
            time_start,
            time_end,
            page,
            page_size,
        }).then(ret => ret.data)
    }
}
export default new CourseTaskService()
