import * as api from '../api'
import config from 'utils/config'
import authUtils from 'utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/teaching`
const url = config.apiHost + `/com/${authUtils.getUserInfo().company_id}`
let company_id = authUtils.getUserInfo().company_id
class Teaching {
    // 搜索带教列表
    searchTeaching ({
        title,
        status,
        create_start_time,
        create_end_time,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { title, status, create_start_time, create_end_time, page, page_size }).then(ret => {
            return ret.data
        })
    }
     // 搜索带教分类
     getMapTypeList({//查询带教分类
        page,
        page_size,
    }){
        let finalUrl = `${urlPre}/template/category/search`
        return api.get(finalUrl, {page, page_size}).then(ret => ret.data)
    }
    //教员列表信息
    getTeachingUserList({
        page,
        page_size,
        keyword,
        department_id
    }){
        let finalUrl = `${urlPre}/teacher/search`
        return api.get(finalUrl, {page, page_size,keyword,department_id}).then(ret => ret.data)
    }
    //教员创建
    creatTeacher(user_id){
        let finalUrl = `${urlPre}/teacher/create`
        return api.post(finalUrl, {user_id}).then(ret => ret.data)
    }
    //删除教员身份
    delTeacher(user_id){
        let finalUrl = `${urlPre}/teacher/delete/${user_id}`
        return api.post(finalUrl).then(ret => ret.data)
    }
    // 带教详情
    viewTeaching (id) {
        let finalUrl = `${urlPre}/${id}`
        return api.get(finalUrl).then(ret => ret.data)
    }
    // 带教模版详情
    viewTeachingTemp (id) {
        let finalUrl = `${urlPre}/template/${id}`
        return api.get(finalUrl).then(ret => ret.data)
    }
    disableTeaching ({
        id,
        status,
    }) {
        let finalUrl = `${urlPre}/${id}/disable`
        return api.put(finalUrl, JSON.stringify({ status })).then(ret => {
            xmview.showTip('success', ret.message || `${status === 2 ? '下线' : '上线'}成功`)
        })
    }
    deleteTeaching (id) {
        let finalUrl = `${urlPre}/${id}`
        return api.del(finalUrl).then(ret => {
            xmview.showTip('success', ret.message || '删除成功')
        })
    }
    // 带教创建
    createTeaching ({
        template_id,
        title,
        image,
        phase_type,
        phase_list,
        finish_exam_id,
        publish_users,
        appraisal,
        learning_sequence
    }) {
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, JSON.stringify({ template_id, title, image, phase_type, phase_list, finish_exam_id, publish_users, appraisal, learning_sequence })).then(ret => {
            xmview.showTip('success', ret.message || '创建成功')
        })
    }
    // 带教更新
    updateTeaching ({
        id,
        template_id,
        title,
        image,
        phase_type,
        phase_list,
        finish_exam_id,
        publish_users,
        appraisal,
        learning_sequence
    }) {
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, JSON.stringify({ template_id, title, image, phase_type, phase_list, finish_exam_id, publish_users, appraisal, learning_sequence })).then(ret => {
            xmview.showTip('success', ret.message || '更新成功')
        })
    }
    // 带教模版搜索
    searchTeachingTemp ({
        type,  // learning_map, teaching
        page,
        page_size,
        category_id
    }) {
        let finalUrl = `${urlPre}/template/search`
        return api.get(finalUrl, { type, page, page_size,category_id }).then(ret => ret.data)
    }
    // 带教实施跟踪
    searchTeachingLearn ({
        title,
        user_id,
        coacher_id,
        be_teaching_status,   // 1通过;2失败
        teaching_status,      // 1通过;2失败
        // create_start_time,
        // create_end_time,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/learn/search`
        return api.get(finalUrl, { title, user_id, coacher_id, be_teaching_status, teaching_status, page, page_size }).then(ret => ret.data)
    }
    // 带教实施跟踪详细
    viewTeachingLearn (id) {
        let finalUrl = `${urlPre}/learn/${id}`
        return api.get(finalUrl).then(ret => ret.data)
    }
    // 带教实施跟踪导出
    exportLearn (fetchParam) {
        fetchParam.user_id = fetchParam.user_id === '' ? void 0 : fetchParam.user_id
        fetchParam.coacher_id = fetchParam.coacher_id === '' ? void 0 : fetchParam.coacher_id
        let finalUrl = `${urlPre}/learn/export`
        return api.post(finalUrl, JSON.stringify(fetchParam)).then(ret => {
            xmview.showTip('success', ret.message || '任务创建成功！请到数据分析中查看')
        })
    }
    // 获取评定模版
    getAppraisalTemp (key) {
        let finalUrl = `${url}/appraisal/template/${key}`
        return api.get(finalUrl).then(ret => ret.data)
    }
    // 带教实施跟踪评定
    appraisal ({
        object_id,
        key: template_key,
        items
    }) {
        let finalUrl = `${urlPre}/appraisal`
        return api.post(finalUrl, JSON.stringify({ object_id, template_key, items }))
    }
    // 带教统计
    searchTeachingUser ({
        user_id,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/user/search`
        return api.get(finalUrl, { user_id, page, page_size }).then(ret => ret.data)
    }
    // 带教统计导出
    exportUser (fetchParam) {
        fetchParam.user_id = fetchParam.user_id === '' ? void 0 : fetchParam.user_id
        let finalUrl = `${urlPre}/user/export`
        return api.post(finalUrl, JSON.stringify(fetchParam)).then(ret => {
            xmview.showTip('success', ret.message || '任务创建成功！请到数据分析中查看')
        })
    }
    // 带教规则详情
    getTeachingRule (id) {
        let finalUrl = `${urlPre}/rule/${id}`
        return api.get(finalUrl).then(ret => ret.data)
    }
}
export default new Teaching()
