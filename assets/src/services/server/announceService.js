import * as api from '../api'
import config from '../../utils/config'
import authUtils from '../../utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/announce`
// 获取公告列表
class Announce {
    getAnnounceList ({
                         page,
                         page_size,
                         keyword,
                         status,
                         type,
                         finished
                     }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { page, page_size, keyword, status, type, finished }).then((ret) => {
            return ret.data
        })
    }
       // 删除文章
    deleteAnnounce (id) {
        let finalUrl = `${urlPre}/${id}/disable`
        return api.put(finalUrl, {})
    }
      // 发布
    publishAnnounce (id) {
        let finalUrl = `${urlPre}/${id}/publish`
        return api.put(finalUrl, {})
    }
        // 撤销
    revokeAnnounce (id) {
        let finalUrl = `${urlPre}/${id}/revoke`
        return api.put(finalUrl, {})
    }
   // 编辑时获取公告
    getEditDetail (id, status) {
        let finalUrl = `${urlPre}/${id}`
        return api.get(finalUrl, {status}).then((ret) => {
            return ret.data
        })
    }
      // 创建公告
    addAnnounceService ({
        title,
        content = '',
        status,
        push_type_id,
        type,
        draft
    }) {
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, {title, content, status, push_type_id, type, draft}).then((ret) => {
            return ret.data
        })
    }

    updateAnnounceService ({
        id,
        title,
        content = '',
        status,
        push_type_id,
        type,
        draft
    }) {
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, {title, content, push_type_id, status, type, draft}).then((ret) => {
            return ret.data
        })
    }

    // 阅读情况
    getReadInfo ({announce_id, user_name, status, page, page_size}) {
        let finalUrl = `${urlPre}/${announce_id}/user`
        return api.get(finalUrl,{page,page_size,user_name,status}).then((ret) => {
            return ret.data
        })
    }
}

export default new Announce()
