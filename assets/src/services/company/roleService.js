// 管理员
import authUtils from '../../utils/authUtils'
import * as api from '../api'
import config from '../../utils/config'
let company_id = authUtils.getUserInfo().company_id
const urlPre = `${config.apiHost}/com/${company_id}/rbac/role`

class RollService {
    // 获取所有角色
    getAllRolls () {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
    // 获取所有启用角色
    getAllUseRolls () {
        let finalUrl = `${urlPre}/own`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
    // 新增角色
    addRoll ({role_name, disabled = 0, description, ids}) {
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, {role_name, disabled, description, ids})
    }
    // 修改角色
    updateRoll ({id, role_name, disabled = 0, description, ids}) {
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, {role_name, disabled, description, ids})
    }
    // 删除角色
    deleteRoll ({role_id}) {
        let finalUrl = `${urlPre}/${role_id}`
        return api.del(finalUrl)
    }
    // 禁用角色
    forbiddeRoll ({role_id}) {
        let finalUrl = `${urlPre}/${role_id}/diabled`
        return api.post(finalUrl)
    }
    // 获取角色信息
    roleInfo ({role_id}) {
        let finalUrl = `${urlPre}/${role_id}`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
    // 获取权限树
    getPermissionTree () {
        let finalUrl = `${config.apiHost}/com/${company_id}/rbac/permission/own`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }

    getFile () {
        return 'https://upload.yst.vodjk.com/assets/download/file/连锁后台权限分配表.xlsx'
    }
}
export default new RollService()
