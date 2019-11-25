// 员工
import authUtils from '../../utils/authUtils'
import * as api from '../api'
import config from '../../utils/config'
let company_id = authUtils.getUserInfo().company_id
const urlPre = `${config.apiHost}/com/${company_id}/user`

class UserService {
    // 获取全部员工列表
    userSearch ({name, mobile, department_id, organization_id, type, is_activity, page, page_size}) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, {name, mobile, department_id, organization_id, type, is_activity, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 获取过滤后的员工列表
    userMiniSearch ({ name, job, mobile, department_id, group_id, page, page_size,join_stime, join_etime }) {
        let finalUrl = `${urlPre}/group/${group_id}/outside`
        return api.get(finalUrl, { name, job, mobile, department_id, page, page_size,join_stime ,join_etime}).then(ret => {
            return ret.data
        })
    }
    // 新增用户
    addUser ({name, staff_id, department_id, job, sex, birthday, join_time, passwd, province = '', city = '', area = '', address, mobile}) {
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, {name, staff_id, department_id, job, sex, birthday, join_time, passwd, province, city, area, address, mobile})
    }
    // 修改用户
    updateUser ({id, name, staff_id, department_id, job, sex, birthday, join_time, passwd, province = '', city = '', area = '', address, mobile}) {
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, {name, staff_id, department_id, job, sex, birthday, join_time, passwd, province, city, area, address, mobile})
    }
    // 删除用户
    deleteUser ({id}) {
        let finalUrl = `${urlPre}/${id}`
        return api.del(finalUrl).then(ret => {
            if (ret.code) {
                Promise.reject(ret)
            }
        })
    }
    // 获取用户信息
    getUserInfo ({id}) {
        let finalUrl = `${urlPre}/${id}`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
    /*
        批量删除用户
        ids 以，分隔的字符串
     */
    batchDelete ({id}) {
        let finalUrl = `${urlPre}/batchdelete`
        return api.post(finalUrl, {id}).then(ret => {
            if (ret.code) {
                Promise.reject(ret)
            } else {
                return ret.data
            }
        })
    }
    // 批量移动到指定组
    bachMove ({ user_id, group_id }) {
        let finalUrl = `${urlPre}/group/batchmove`
        return api.post(finalUrl, { user_id, group_id }).then(ret => {
            xmview.showTip('success', '移入成功')
        })
    }
    batchGroupDelete ({user_id, group_id}) {
        let finalUrl = `${urlPre}/group/batchdelete`
        return api.post(finalUrl, {user_id, group_id}).then(ret => {
            if (ret.code) {
                Promise.reject(ret)
            }
        })
    }
    // 获取指定用户信息
    userInfo ({user_id}) {
        let finalUrl = `${urlPre}/${user_id}`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
    // 获取用户组列表
    userGroupSearch ({keyword, page = 1, page_size = 15}) {
        let finalUrl = `${urlPre}/group/search`
        return api.get(finalUrl, { keyword, page, page_size }).then((ret) => {
            return ret.data
        })
    }
    // 获取用户组下面用户的列表
    userGroupUserSearch ({group_id, keyword, page, page_size}) {
        let finalUrl = `${urlPre}/group/${group_id}/user`
        return api.get(finalUrl, {keyword, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 新增用户组
    /*
        user_id 所有员工的id 以 ，分隔
     */
    addUserGroup ({name, user_id = '', description}) {
        let finalUrl = `${urlPre}/group`
        return api.post(finalUrl, {name, user_id, description}).then((ret) => {
            return ret.data
        })
    }
    // 修改用户组
    updateUserGroup ({id, name, user_id = '', description}) {
        let finalUrl = `${urlPre}/group/${id}`
        return api.put(finalUrl, {name, user_id, description})
    }
    updateUserGroupInfo ({id, name, description}) {
        let finalUrl = `${urlPre}/group/${id}/info`
        return api.put(finalUrl, {name, description})
    }
    // 用户组详情
    viewUserGroup ({id}) {
        let finalUrl = `${urlPre}/group/${id}`
        return api.get(finalUrl).then(ret => {
            return ret.data
        })
    }
    // 删除用户组
    deleteUserGroup ({id}) {
        let finalUrl = `${urlPre}/group/${id}`
        return api.del(finalUrl).then(ret => {
            if (ret.code) {
                Promise.reject(ret)
            }
        })
    }
    // 移动店员
    moveUser ({pid, id}) {
        let finalUrl = `${urlPre}/move`
        return api.post(finalUrl, {pid, id})
    }

    // 组织架构导出
    organizationExport (params) {
        let finalUrl = `${urlPre}/export`
        return api.post(finalUrl, { type: 'organization_user', params: JSON.stringify(params) }).then(ret => {
            if (ret.code) {
                Promise.reject(ret)
            }
            return ret
        })
    }

    getUserUploadUrl () {
        return `${urlPre}/import`
    }

    getUserTemplateUrl () {
        return 'https://upload.yst.vodjk.com/assets/download/import/user_new.xlsx'
    }

    organizationSectionImport () {
        let finalUrl = `${urlPre}/section/import`
        return api.post(finalUrl).then(ret => {
            if (ret.code) {
                Promise.reject(ret)
            }
        })
    }
    // 用户组导出
    userGroupExport (params) {
        let finalUrl = `${urlPre}/group/export`
        return api.post(finalUrl, params).then(ret => {
        })
    }
}
export default new UserService()
