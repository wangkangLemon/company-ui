import * as api from '../api'
import config from '../../utils/config'
import authUtils from '../../utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/speaking`
//  企业药我说
class SpeakingService {
   // 获取内容列表
    getSpeakingList ({keyword, publish_status = -1, send_range = '', send_type = '', page, page_size}) {
        let url = `${urlPre}/search`
        return api.get(url, {keyword, publish_status, send_range, send_type, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 获取药我说统计
    getSpeakingStat ({
        keyword,
        send_range,
        sender_type,
        start_time,
        end_time,
        page = 1,
        page_size = 15
    }) {
        let url = `${urlPre}/stat/search`
        return api.get(url, { keyword, send_range, sender_type, start_time, end_time, page, page_size }).then(ret => {
            return ret.data
        })
    }
    // 删除
    delSpeaking (id) {
        let url = `${urlPre}/${id}/delete`
        return api.del(url, {})
    }
    // 上线下线
    disableSpeaking (id, status) {
        let url = `${urlPre}/${id}/disable`
        return api.put(url, {status})
    }
    uploadImg ({image, alias}) {
        let url = `${urlPre}/cover`
        return api.post(url, {image, alias}).then((ret) => ret.data)
    }
    addSpeaking (form) {
        if (form.end_time === null) {
            form.end_time = ''
        }
        let url = `${urlPre}`
        return api.post(url, form)
    }
    updateSpeaking (form) {
        if (form.end_time === null) {
            form.end_time = ''
        }
        let url = `${urlPre}/${form.id}`
        return api.put(url, form)
    }
    getSpeaking (id) {
        let url = `${urlPre}/${id}`
        return api.get(url, {}).then((ret) => ret.data)
    }
    // 获取录音记录
    getSpeakingHistory ({
        keyword,
        name,
        staff_id,
        score,
        department_id,
        time_start,
        time_end,
        page = 1,
        page_size = 15,
        is_export
    }) {
        let url = `${urlPre}/history/search`
        return api.get(url, {
            keyword,
            name,
            staff_id,
            score,
            department_id,
            time_start,
            time_end,
            page,
            page_size,
            is_export
        }).then(ret => {
            if (is_export === 1) {
                return null
            } else {
                return ret.data
            }
        })
    }

    fileExport (params) {
        let url = `${urlPre}/stat/export`
        return api.post(url, params).then(ret => {
            if (ret.code) {
                Promise.reject(ret)
            }
            return ret
        })
    }
}

export default new SpeakingService()
