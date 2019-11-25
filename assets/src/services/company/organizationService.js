// 组织架构
import authUtils from '../../utils/authUtils'
import * as api from '../api'
import config from '../../utils/config'
let company_id = authUtils.getUserInfo().company_id
const urlPre = `${config.apiHost}/com/${company_id}/department`

class OrganizationService {
    // 获取整个组织架构树
    getOrganizationTree ({
        organization_id = 0,
        user_id = 0,
        keyword,
        is_org = 0,
    }) {
        let finalUrl = `${urlPre}/${organization_id}/tree`
        return api.get(finalUrl, { is_org, user_id, keyword }).then((ret) => {
            return ret.data
        })
    }
    // 获取当前组织架构下的用户
    getOrganizationUser ({
        keyword,
        is_activity = '',
        organization_id,
        page = 1,
        page_size = 15,
        
       
    }) {
        let finalUrl = `${urlPre}/${organization_id}/user`
        return api.get(finalUrl, { keyword, is_activity, page, page_size}).then(ret => {
            return ret.data
        })
    }

    // 获取整个组织架构树(无门店)
    getPartialTree () {
        let finalUrl = `${urlPre}/partialtree`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }

    // 新增部门
    addSection ({name, pid, sort, description}) {
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, {name, pid, sort, description}).then((ret) => {
            return ret.data
        })
    }
    // 修改部门
    updateSection ({id, name, pid, sort, description}) {
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, {name, pid, sort, description})
    }
    // 删除部门
    deleteSection ({id}) {
        let finalUrl = `${urlPre}/${id}`
        return api.del(finalUrl).then(ret => {
            if (ret.code) {
                Promise.reject(ret)
            }
        })
    }
    // 获取部门信息
    getSectionInfo ({id}) {
        let finalUrl = `${urlPre}/${id}`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
    // 移动部门
    moveSection ({id, pid}) {
        let finalUrl = `${urlPre}/${id}/move`
        return api.post(finalUrl, {pid}).then(ret => {
            if (ret.code) {
                Promise.reject(ret)
            } else {
                return ret.data
            }
        })
    }
}
export default new OrganizationService()
