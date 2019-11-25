import * as api from './api'
import config from '../utils/config'
import authUtils from '../utils/authUtils'

// 获取用户列表     //type 默认 all  部门 2
export function userList ({ keyword = '', page, pageSize, department_id, type }) {
    let url = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/user/search`
    return api.get(url, { type, keyword, page, page_size: pageSize, department_id }, false).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}
export function userNameList ({ keyword = '', page, page_size, department_id, type,user_status }) {
    let url = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/user/search/name`
    return api.get(url, { type, keyword, page, page_size, department_id,user_status }, false).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}

// 获取用户组列表
export function userGroup (keyword, page, pageSize, type) {
    let url = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/user/group/search`
    return api.get(url, { type, keyword, page, page_size: pageSize }, false).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}
