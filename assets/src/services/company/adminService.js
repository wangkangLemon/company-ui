// 管理员
import authUtils from '../../utils/authUtils'
import * as api from '../api'
import config from '../../utils/config'
let company_id = authUtils.getUserInfo().company_id
const urlPre = `${config.apiHost}/com/${company_id}/rbac/admin`

class AdminService {
    // 获取管理员列表
    adminSearch ({keyword, role_id, page, page_size}) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, {keyword, role_id, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 新增管理员
    addAdmin ({name, department_id, user_id, roles, departments, passwd, mobile}) {
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, {name, department_id, user_id, roles, departments, passwd, mobile})
    }
    adminInfo ({id}) {
        let finalUrl = `${urlPre}/${id}`
        return api.get(finalUrl, {}).then((ret) => {
            return ret.data
        })
    }
    // 修改管理员
    updateAdmin ({id, name, department_id, user_id, roles, departments, passwd, mobile}) {
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, {name, department_id, user_id, roles, departments, passwd, mobile})
    }
    // 删除管理员
    deleteAdmin ({id}) {
        let finalUrl = `${urlPre}/${id}`
        return api.del(finalUrl)
    }
    // 禁用管理员
    disableAdmin ({id, disabled}) {
        let finalUrl = `${urlPre}/${id}/disable`
        return api.put(finalUrl, { disabled })
    }
    /*
        批量删除用户
        ids 以，分隔的字符串
     */
    batchDelete ({id}) {
        let finalUrl = `${urlPre}/batchdelete`
        return api.post(finalUrl, {id})
    }

    fileExport (params) {
        let finalUrl = `${urlPre}/export`
        return api.post(finalUrl, params).then(ret => {
            if (ret.code) {
                Promise.reject(ret)
            }
            return ret
        })
    }
}
export default new AdminService()
