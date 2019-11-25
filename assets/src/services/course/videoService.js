import * as api from '../api'
import authUtils from '../../utils/authUtils'
import config from '../../utils/config'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/course`

class VideoService {
    //  获取视频列表
    getVideo ({status, keyword, page, page_size, time_start, time_end}) {
        let url = `${urlPre}/video/search`
        return api.get(url, {status, keyword, page, page_size, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }
    // 添加视频
    addVideo ({name, company_id, tags, product_id, source_type, source_url}) {
        let url = `${urlPre}/video`
        return api.post(url, {name, company_id, tags, product_id, source_type, source_url})
    }
      // 修改视频
    updateVideo ({name, company_id, tags, cover, duration, id}) {
        let url = `${urlPre}/video/${id}`
        return api.put(url, {name, comid: company_id, tags, cover, duration})
    }
    refreshVideoStatus ({id}) {
        let url = `${urlPre}/video/${id}`
        return api.get(url).then(ret => {
            return ret.data
        })
    }
    deleteVideo ({id}) {
        let url = `${urlPre}/video/${id}`
        return api.del(url)
    }
    // 获取oss的上传token
    getOssToken ({companyid} = {}) {
        let finalUrl = `${urlPre}/video/upload`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
      // 获取上传封面的url
    getVideoUploadCoverUrl () {
        return `${urlPre}/video/cover`
    }
    // 获取视频预览地址
    getVideoPreviewUrl (id) {
        let url = `${urlPre}/video/${id}/preview`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }
}

export default new VideoService()
