/**
 * Created by huangrui on 2017/3/31.
 */
import * as api from './api'
import authUtils from '../utils/authUtils'
import config from '../utils/config'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/newcourse`

class CourseService {
    // 获取课程分析列表
    getAnalysis ({ type, course_id, date, page, page_size }) {
        let url = `${urlPre}/stat/search`
        return api.get(url, { type, course_id, date, page, page_size }).then(ret => {
            return ret.data
        })
    }

    // 导出课程分析
    exportAnalysis ({ type, course_id, date, page, page_size }) {
        let url = `${urlPre}/stat/search`
        return api.downLoad(url, { type, course_id, date, page, page_size, export: 1 }, '课程分析.xls')
    }

    // 获取连锁学习情况
    getStoreLearn ({ date, page, page_size, store_id, course_id }) {
        let url = `${urlPre}/stat/${course_id}/store/search`
        return api.get(url, { date, store_id, page, page_size }).then(ret => {
            return ret.data
        })
    }

    // 导出连锁学习情况
    exportStoreLearn ({ date, page, page_size, store_id, course_id }) {
        let url = `${urlPre}/stat/${course_id}/store/search`
        return api.downLoad(url, { date, store_id, page, page_size, export: 1 }, '连锁店学习情况.xls')
    }

    // 获取门店学习情况
    getDepLearn ({ date, page, page_size, department_id, store_id, course_id }) {
        let url = `${urlPre}/stat/${course_id}/${store_id}/department/search`
        return api.get(url, { date, page, page_size, department_id }).then(ret => {
            return ret.data
        })
    }

    // 导出门店学习情况
    exportDepLearn ({ date, page, page_size, department_id, store_id, course_id }) {
        let url = `${urlPre}/stat/${course_id}/${store_id}/department/search`
        return api.downLoad(url, { date, page, page_size, department_id, export: 1 }, '门店学习情况.xls')
    }

    // 获取店员学习情况
    getUserLearn ({ date, page, page_size, department_id, store_id, course_id }) {
        let url = `${urlPre}/stat/${course_id}/${store_id}/${department_id}/user/search`
        return api.get(url, { date, page, page_size }).then(ret => {
            return ret.data
        })
    }

    // 导出店员学习情况
    exportUserLearn ({ date, page, page_size, department_id, store_id, course_id }) {
        let url = `${urlPre}/stat/${course_id}/${store_id}/${department_id}/user/search`
        return api.downLoad(url, { date, page, page_size, export: 1 }, '店员学习情况.xls')
    }

    // 获取课程下拉列表
    courseList (keyword, page, pageSize, is_task = -1, status = -1, type, category_id) {
        let url = `${urlPre}/search/name`
        return api.get(url, { keyword, page, page_size: pageSize, is_task, status, type, category_id }).then(ret => {
            return ret.data
        })
    }

    // 获取公开课列表
    getPublicCourselist ({
        keyword = '',
        status = '',
        type = '',
        time_start = '',
        time_end = '',
        albumid = '',
        category_id = '',
        companyid = '',
        need_testing = '',
        page = '',
        page_size = '',
    }) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/newcourse/search`
        return api.get(finalUrl, {
            keyword, // 课程名称
            status, // 课程状态 不赋值则表示全部，0为正常，1为下线，2为视频转码中
            type,
            time_start,
            time_end,
            albumid,
            category_id,
            need_testing, // 课后考试 不赋值则表示全部，0为不需要，1为需要
            page,
            page_size,
        }).then(ret => {
            return ret.data
        })
    }

    // 获取公开课列表
    getPublicCourselistByName ({
        keyword = '',
        status = '',
        type = '',
        is_task,
        publish_status='',
        time_start = '',
        time_end = '',
        albumid = '',
        category_id = '',
        companyid = '',
        need_testing = '',
        page = '',
        page_size = '',
    }) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/newcourse/search/name`
        return api.get(finalUrl, {
            keyword, // 课程名称
            status, // 课程状态 不赋值则表示全部，0为正常，1为下线，2为视频转码中
            type,
            is_task,
            publish_status,
            time_start,
            time_end,
            albumid,
            category_id,
            need_testing, // 课后考试 不赋值则表示全部，0为不需要，1为需要
            page,
            page_size,
        }).then(ret => {
            return ret.data
        })
    }

    // 获取课程列表
    getCourseList ({ status, category, company_id, page, page_size, time_start, time_end, keyword }) {
        let url = urlPre + '/search'
        return api.get(url, {
            status, // 2- 视屏转码中 1-下线 0-正常
            category, // 1-工业 2-连锁
            company_id,
            page,
            page_size,
            time_start,
            time_end,
            keyword
        }).then(ret => {
            return ret.data
        })
    }

    // 添加课程
    addCourse ({
        companyid,
        category_id,
        name,
        image,
        material_type,
        material_id,
        albumid = '',
        description,
        study_score = '',
        need_testing,
        limit_time,
        limit_repeat = '',
        score_pass = '',
        price_enabled = '',
        price = '',
        price_float = '',
        push_type,
        push_type_id,
        subject_type,
        subject_time
    }) {
        let finalUrl = urlPre
        return api.post(finalUrl, {
            category_id,
            name,
            image,
            material_type,
            material_id,
            albumid,
            description,
            study_score,
            need_testing,
            limit_time,
            limit_repeat,
            score_pass,
            price_enabled,
            price,
            price_float,
            push_type,
            push_type_id,
            subject_type,
            subject_time
        }).then((ret) => {
            return ret.data
        })
    }

    // 修改课程获取课程信息接口
    getCourseInfo ({ course_id }) {
        let finalUrl = `${urlPre}/${course_id}/view`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
    // 修改课程
    editCourse ({ companyid, id, category_id, name, image, material_type, material_id, albumid = '', description, study_score = '', need_testing, limit_time, limit_repeat = '', score_pass = '', price_enabled = '', price, price_float = '', push_type, push_type_id, subject_type, subject_time }) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, {
            category_id,
            name,
            image,
            material_type,
            material_id,
            albumid,
            description,
            study_score,
            need_testing,
            limit_time,
            limit_repeat,
            score_pass,
            price_enabled,
            price,
            price_float,
            push_type,
            push_type_id,
            subject_type,
            subject_time
        }).then((ret) => {
            return ret.data
        })
    }

    // 上下线课程
    offlineCourse ({ companyid, course_id, disabled }) {
        let finalUrl = `${urlPre}/${course_id}/disable`
        return api.put(finalUrl, { disabled })
    }

    // 获取添加编辑课程上传图片的url (与题目里的上传图片的url为同一个)
    getManageImgUploadUrl ({ companyid } = {}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        return `${config.apiHost}/com/${companyid}/course/image`
    }

    // 删除课程
    deleteCourse ({ companyid, course_id }) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/${course_id}`
        return api.del(finalUrl, {})
    }

    // 获取视频预览地址
    getVideoPreviewUrl (id) {
        let url = `${urlPre}/video/${id}/preview`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }

    // 批量删除课程
    deleteCourseMulty ({ companyid, id }) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/batchdel`
        return api.post(finalUrl, { id })
    }

    // 批量删除视频
    deleteVideoMulty ({ id }) {
        let finalUrl = `${urlPre}/video/batchdel`
        return api.post(finalUrl, { id })
    }

    // 批量移动课程到指定分类
    moveCourseToCategoryMulty ({ id, catid }) {
        let finalUrl = `${urlPre}/batchmove`
        return api.post(finalUrl, { id, catid })
    }

    // 弹出框请求的视频列表
    getVideo4Dialog ({ companyid, doc_type, status, keyword, page, page_size }) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/video/search`
        return api.get(finalUrl, { keyword, doc_type, status, page, page_size })
    }

    // 获取文档上传url
    getCourseDocUploadUrl ({ companyid } = {}) {
        return `${config.apiHost}/com/${authUtils.getUserInfo().company_id}/course/doc/upload`
    }

    // 添加编辑课程上传图片
    uploadCover4addCourse ({ companyid, image, alias = Date.now() + '.jpg' }) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let url = `${config.apiHost}/com/${companyid}/course/image`
        return api.post(url, { image, alias }).then((ret) => {
            return ret.data
        })
    }

    // 获取课程题目
    getTestingInfo ({ companyid, course_id }) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/${course_id}/subject/view`
        return api.get(finalUrl).then((ret) => {
            return ret.data.subjects
        })
    }

    // 添加或修改题目
    addOrEditTesting ({ companyid, course_id, subjects }) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/${course_id}/subject`
        return api.put(finalUrl, subjects).then((ret) => {
            return ret.data
        })
    }

    getDocList ({ page, page_size, keyword, company_id, file_type, time_start, time_end, status, doc_type }) {
        let prefix = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/course`
        let url = `${prefix}/doc/search`
        return api.get(url, { page, page_size, keyword, company_id, file_type, time_start, time_end, status, doc_type }).then((ret) => {
            return ret.data
        })
    }
    // ============================================= 栏目 开始 ======================================================
    // 获取课程栏目树

    getCategoryTree ({ companyid, id = 'tree', filter = true, course_type }) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/category/children`
        return api.get(finalUrl, { id, filter, course_type }).then(ret => {
            return ret.data
        }).catch((ret) => {
            ret.tipCom && ret.tipCom.close()
            return ret
        })
    }
}

export default new CourseService()
