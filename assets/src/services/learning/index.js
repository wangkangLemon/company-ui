import * as api from '../api'
import config from 'utils/config'
import authUtils from 'utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/maps`

class StudyMap {
    // 学习地图任务模板
    searchStudyMap ({
        learning_maps_name,
        time_start,
        time_end,
        publish_type,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { learning_maps_name, time_start, time_end, publish_type, page, page_size }).then(ret => {
            return ret.data
        })
    }
    // 学习地图模版名称检索
    searchStudyMapName ({
        keyword,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/search/name`
        return api.get(finalUrl, { keyword, page, page_size }).then(ret => ret.data)
    }
    // 员工学习地图数据统计
    searchUserMap ({
        user_name,
        mobile,
        department_id,
        learning_maps_id,
        is_export,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/search/user`
        return api.get(finalUrl, { user_name, mobile, department_id, learning_maps_id, is_export, page, page_size }).then(ret => {
            return is_export === 2 ? ret.data : xmview.showTip('success', ret.message || '导出成功')
        })
    }
    // 学习记录
    searchMapByUser ({
        learning_maps_id,
        user_id,
        phase,
        time_start,
        time_end,
        is_export,
        page,
        page_size,
    }) {
        let finalUrl = `${urlPre}/${learning_maps_id}/${user_id}`
        return api.get(finalUrl, { is_export, phase, time_start, time_end, }).then(ret => {
            return is_export === 2 ? ret.data : null
        })
    }
    // 获取学习地图模板
    getStudyMap (learning_maps_id) {
        let finalUrl = `${urlPre}/${learning_maps_id}`
        return api.get(finalUrl).then(ret => {
            return ret.data
        })
    }
    // 创建学习地图
    createStudyMap ({
        total_phase,
        title,
        image,
        type,
        push_type_id,
        phase_list
    }) {
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, { total_phase, title, image, type, push_type_id, phase_list }, false, true).then(ret => {
            xmview.showTip('success', ret.message || '创建成功')
        })
    }
    updateStudyMap ({
        learning_maps_id,
        total_phase,
        title,
        image,
        type,
        push_type_id,
        phase_list
    }) {
        let finalUrl = `${urlPre}/${learning_maps_id}`
        return api.put(finalUrl, { total_phase, title, image, type, push_type_id, phase_list }, false, true).then(ret => {
            xmview.showTip('success', ret.message || '更新成功')
        })
    }
    deletePhase ({
        learning_maps_id,
        phase_id
    }) {
        let finalUrl = `${urlPre}/${learning_maps_id}/${phase_id}`
        return api.del(finalUrl).then(ret => {
            xmview.showTip('success', ret.message || '删除阶段成功')
        })
    }
    uploadCover ({
        image,
        alias
    }) {
        let finalUrl = `${urlPre}/image`
        return api.post(finalUrl, { image, alias }).then(ret => {
            return ret.data
        })
    }
}
export default new StudyMap()
